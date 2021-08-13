const Wishlist = require("../models/Wishlist");

exports.addToWishlist = (req, res) => {
  const user = req.user.id;

  const item = {
    product: req.query.productId
  };

  Wishlist.findOne({ user: user }, (err, foundWishlist) => {
    if (err) {
      res.status(400).json({ message: "Couldn't find user wish list", err });
    } else if (foundWishlist) {
      let productsInWishlist = foundWishlist.items.map(item => item.product);
      if (productsInWishlist.includes(item.product)) {
        res.status(400).json({ message: "You already added this item", err });
      } else {
        foundWishlist.items.push(item);
        foundWishlist.save().then(wishlist => {
          res.status(200).json({ message: "Added to wish List", wishlist });
        });
      }
    } else {
      Wishlist.create({ user: user, items: [item] })
        .then(wishlist => {
          res.status(200).json({ message: "Added to wish List", wishlist });
        })
        .catch(err => {
          res.status(400).json({ message: "Couldn't add to wish List", err });
        });
    }
  });
};


exports.userWishlist = (req, res) => {
  let userId = req.user.id;

  Wishlist.findOne({ user: userId })
    .populate("items.product")
    .exec((err, wishlist) => {
      if (err) {
        res.status(400).json({ message: "Couldn't find wish List", err });
      } else {
        if (!wishlist) {
          res.status(400).json({ message: "no wish List" });
        } else {
          res.status(200).json({ message: "wish List", wishlist });
        }
      }
    });
};


exports.removeFromWishlist = (req, res) => {
  let userId = req.user.id;

  Wishlist.findOneAndUpdate(
    { user: userId },
    { $pull: { items: { product: req.query.productId } } },
    { new: true, useFindAndModify: false },
    err => {
      if (err) {
        res.status(400).json({ message: "Couldn't find wish list", err });
      } else {
        Wishlist.findOne({ user: userId })
          .populate("items.product")
          .exec((err, wishlist) => {
            if (err) {
              res.status(400).json({ message: "Couldn't find wish List", err });
            } else {
              res.status(200).json({ message: "Deleted Succefully", wishlist });
            }
          });
      }
    }
  );
};
