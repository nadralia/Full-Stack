const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Shipper = require("../models/Shipper");
const mongoose = require("mongoose");


exports.orderSuccess = (req, res) => {
  let userId = req.user.id;

  Cart.findOne({ user: userId }).then(cart => {
    if (cart.items.length === 0) {
      res.status(400).json({ message: "Your cart is empty" });
    } else {
      let cartInfo = cart.items;

      cartInfo.forEach(item => {
        Product.updateOne(
          { _id: item.product },
          {
            $inc: {
              numberInStock: -item.quantity
            }
          },
          { new: true },
          err => {
            if (err) {
              return res.status(400).json({
                message: "Couldn't decrease item's quantity",
                err
              });
            }
          }
        );
      });

      Cart.findOne({ user: userId }).then(foundCart => {
        if (!foundCart.address) {
          res.status(400).json({ message: "Please Select order address" });
        } else {
          createOrderAndEmptyCart();
        }

        function createOrderAndEmptyCart() {
          Order.create({
            user: userId,
            products: foundCart.items,
            totalPrice: foundCart.totalPrice,
            address: foundCart.address
          }).then(() => {
            // Then empty the user's cart
            Cart.findOneAndUpdate(
              { user: userId },
              { $set: { items: [], totalPrice: 0, address: null } },
              { new: true, useFindAndModify: false },
              (err, cart) => {
                if (err)
                  res.status(400).json({
                    message: "Error in order",
                    err
                  });
                else {
                  res.status(200).json({
                    message: "Ordered Placed",
                    cart
                  });
                }
              }
            );
          });
        }
      });
    }
  });
};

exports.userOrdersHistory = (req, res) => {
  let userId = req.user.id;

  Order.find({ user: userId })
    .sort({ orderDate: -1 })
    .populate({
      path: "products.product",
      model: "Product",
      populate: {
        path: "seller",
        model: "User",
        select: "username"
      }
    })
    .populate("address")
    .exec((err, orders) => {
      if (err) {
        res.status(400).json({ message: "Couldn't find cart", err });
      } else {
        res.status(200).json({ message: "All user's orders", orders });
      }
    });
};

exports.ordersToShip = (req, res) => {
  let userId = req.user.id;

  Order.aggregate(
    [
      { $unwind: "$products" },
      { $unwind: "$products.product" },
      { $sort: { orderDate: 1 } }
    ],
    function (err, result) {
      Order.populate(
        result,
        [
          {
            path: "products.product",
            model: "Product"
          },
          { path: "address", model: "Address" }
        ],
        function (err, results) {
          let sellerItemsToShip = results.filter(
            order =>
              order.products.product.seller == userId &&
              order.products.orderState.shipped == false
          );
          if (err) res.status(400).json({ message: "Couldn't get orders", err });
          return res.status(200).json({ ordersToShip: sellerItemsToShip });
        }
      );
    }
  );
};

exports.shippedOrders = (req, res) => {
  let userId = req.user.id;

  Order.aggregate(
    [
      { $unwind: "$products" },
      { $unwind: "$products.product" },
      { $sort: { orderDate: -1 } }
    ],
    function (err, result) {
      Order.populate(
        result,
        [
          {
            path: "products.product",
            model: "Product"
          },
          { path: "address", model: "Address" }
        ],
        function (err, results) {
          let sellerShippedOrders = results.filter(
            order =>
              order.products.product.seller == userId &&
              order.products.orderState.shipped == true
          );
          if (err) res.status(400).json({ message: "Couldn't get orders", err });
          return res.status(200).json({ shippedOrders: sellerShippedOrders });
        }
      );
    }
  );
};

exports.markAsShipped = (req, res) => {
  let orderId = req.query.orderId;

  Order.findOneAndUpdate(
    {
      products: { $elemMatch: { _id: mongoose.Types.ObjectId(orderId) } }
    },
    { $set: { "products.$.orderState.shipped": true } },
    { new: true, useFindAndModify: false },
    (err, order) => {
      if (err) {
        res.status(400).json({ message: "Couldn't mark shipped, try again.", err });
      } else {
        let shippedOrder = order.products.filter(item => item._id == req.query.orderId);
        let updatedItemOnly = shippedOrder[0];

        res
          .status(200)
          .json({ message: "Marked as shipped", shippedOrder: updatedItemOnly });
      }
    }
  );
};

exports.ordersToDeliver = (req, res) => {
  let userId = req.user.id;

  Shipper.findOne({ user: userId }, (err, shipper) => {
    Order.find()
      .sort({ orderDate: -1 })
      .populate("address")
      .populate({ path: "products.product", model: "Product" })
      .exec((err, orders) => {
        let areaOrders = orders.filter(order => order.address.state == shipper.area);
        res.json({ areaOrders });
      });
  });
};


exports.markAsDelivered = (req, res) => {
  let orderId = req.query.orderId;

  Order.findOneAndUpdate(
    {
      products: { $elemMatch: { _id: mongoose.Types.ObjectId(orderId) } }
    },
    {
      $set: {
        "products.$.orderState.delivered": true,
        deliveredDate: Date().toString()
      }
    },
    { new: true, useFindAndModify: false }
  )
    .populate("address")
    .exec((err, order) => {
      if (err) {
        res.status(400).json({ message: "Couldn't mark delivered, try again.", err });
      } else {

        let deliveredOrder = order.products.filter(item => item._id == req.query.orderId);
        let updatedItemOnly = deliveredOrder[0];

        res.status(200).json({
          message: "Marked as delivered",
          order,
          deliveredItem: updatedItemOnly
        });
      }
    });
};
