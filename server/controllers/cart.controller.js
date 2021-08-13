const Cart = require("../models/Cart");
const Product = require("../models/Product");


exports.addToCart = (req, res) => {
  const userId = req.user.id;

  const productId = req.query.productId;

  const item = {
    product: productId,
    quantity: req.body.orderQuantity == null || 0 ? 1 : req.body.orderQuantity,
    orderState: {
      pending: true,
      shipped: false,
      delivered: false,
      returned: false,
      refunded: false
    }
  };


  Product.findById(productId, (err, foundProduct) => {
    if (foundProduct.numberInStock === 0) {
      return res.status(400).json({
        message: "The product went out of stock."
      });
    } else {
      addToCart();
    }
  });

  function addToCart() {
    Cart.findOne({ user: userId }, (err, foundCart) => {
      if (err) {
        res.status(400).json({
          message: "Couldn't find user cart",
          err
        });
      } else if (foundCart) {
        let productsInCart = foundCart.items.map(item => item.product);

        if (productsInCart.includes(productId)) {
          if (!req.body.orderQuantity) {
            res.status(400).json({
              message: "Product already in cart"
            });
          } else {
            Cart.findOneAndUpdate(
              {
                user: userId,
                items: {
                  $elemMatch: { product: productId }
                }
              },
              { $set: { "items.$.quantity": req.body.orderQuantity } },
              { new: true, useFindAndModify: false },
              (err, cart) => {
                if (err) {
                  res.status(400).json({
                    message: "Couldn't add to cart",
                    err
                  });
                } else {
                  res.status(200).json({
                    message: "Quantity changed in the cart",
                    cart
                  });
                }
              }
            );
          }
        } else {
          foundCart.items.push(item);
          foundCart.save().then(cart => {
            res.status(200).json({ message: "Added to cart", cart });
          });
        }
      } else {
        Cart.create({ user: userId, items: [item] })
          .then(cart => {
            res.status(200).json({ message: "Added to cart", cart });
          })
          .catch(err => {
            res.status(400).json({
              message: "Couldn't add to cart",
              err
            });
          });
      }
    });
  }
};


exports.userCartInfo = (req, res) => {
  let userId = req.user.id;

  Cart.findOne({ user: userId })
    .populate("items.product")
    .exec((err, cart) => {
      if (err) {
        res.status(400).json({ message: "Couldn't find cart", err });
      } else {
        if (!cart) {
          res.status(400).json({ message: "no cart" });
        } else {
          let cartItems = cart.items;
          let total = cartItems.reduce(function (a, b) {
            return a + b.product.price * b.quantity;
          }, 0);

          Cart.findOneAndUpdate(
            { user: userId },
            { totalPrice: total },
            { new: true, useFindAndModify: false }
          )
            .populate("items.product")
            .then(cart => {
              res.status(200).json({ message: "cart", cart });
            });
        }
      }
    });
};


exports.removeFromCart = (req, res) => {
  let userId = req.user.id;

  Cart.findOneAndUpdate(
    { user: userId },
    { $pull: { items: { product: req.query.productId } } },
    { new: true, useFindAndModify: false },
    err => {
      if (err) {
        res.status(400).json({ message: "Couldn't find cart", err });
      } else {
        Cart.findOne({ user: userId })
          .populate("items.product")
          .exec((err, cart) => {
            if (err) {
              res.status(400).json({ message: "Couldn't find cart", err });
            } else {

              let cartItems = cart.items;
              let total = cartItems.reduce(function (a, b) {
                return a + b.product.price * b.quantity;
              }, 0);

              Cart.findOneAndUpdate(
                { user: userId },
                { totalPrice: total },
                { new: true, useFindAndModify: false }
              )
                .populate("items.product")
                .then(cart => {
                  res.status(200).json({ message: "Deleted Succefully", cart });
                });
            }
          });
      }
    }
  );
};


exports.changeQuantityFromCart = (req, res) => {
  const userId = req.user.id;

  const productId = req.query.productId;

  Cart.findOneAndUpdate(
    {
      user: userId,
      items: {
        $elemMatch: { _id: productId }
      }
    },
    { $set: { "items.$.quantity": req.body.orderQuantity } },
    { new: true, useFindAndModify: false }
  )
    .populate({ path: "items.product", model: "Product" })
    .exec((err, cart) => {
      if (err) {
        res.status(400).json({
          message: "Couldn't add to cart",
          err
        });
      } else {
        let cartItems = cart.items;
        let total = cartItems.reduce(function (a, b) {
          return a + b.product.price * b.quantity;
        }, 0);

        Cart.findOneAndUpdate(
          { user: userId },
          { totalPrice: total },
          { new: true, useFindAndModify: false }
        )
          .populate("items.product")
          .then(cart => {
            res.status(200).json({ message: "Quantity changed in the cart", cart });
          });
      }
    });
};

exports.chooseOrderAddress = (req, res) => {
  const userId = req.user.id;

  Cart.findOneAndUpdate(
    { user: userId },
    { $set: { address: req.body.address } },
    { new: true, useFindAndModify: false }
  ).exec((err, cart) => {
    if (err) {
      res.status(400).json({
        message: "Couldn't update address",
        err
      });
    } else {
      res.status(200).json(cart);
    }
  });
};
