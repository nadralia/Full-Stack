const Shipper = require("../models/Shipper");
const User = require("../models/User");

const mongoose = require("mongoose");

exports.getAllUsers = (req, res) => {
  User.find({ username: { $nin: ["admin"] } })
    .sort({ creationDate: -1 })
    .select("-password")
    .then(users => {
      res.status(200).json({ users });
    })
    .catch(err => {
      res.json(err);
    });
};

exports.getAllShippers = (req, res) => {
  Shipper.find()
    .populate("user")
    .then(shippers => {
      res.status(200).json({ shippers });
    })
    .catch(err => {
      res.json(err);
    });
};

exports.addShipper = (req, res) => {
  let shipperId = req.body.shipperId;
  let isShipper = req.body.isShipper; 


  let newShipper = new Shipper({
    user: shipperId,
    isActiveShipper: true
  });


  if (isShipper == "true") {
    updateOrCreateShipper();
  } else {
    //if false
    deactivateShipper();
  }

  function updateOrCreateShipper() {
    Shipper.findOne({ user: shipperId }, (err, foundShipper) => {
      if (foundShipper && foundShipper.isActiveShipper == true) {
        res.status(400).json({
          message: "The user is already a shipper"
        });

      } else if (foundShipper && foundShipper.isActiveShipper == false) {
        User.findOneAndUpdate(
          { _id: shipperId },
          { $set: { isShipper: true } },
          { new: true, useFindAndModify: false }
        ).then(user => {
          foundShipper.isActiveShipper = true;

          foundShipper.save().then(shipper => {
            res.status(200).json({
              message: "The user is shipper again",
              user
            });
          });
        });

      } else {
        User.findOneAndUpdate(
          { _id: shipperId },
          { $set: { isShipper: true } },
          { new: true, useFindAndModify: false }
        ).then(user => {
          newShipper
            .save()
            .then(shipper => {
              res.status(200).json({
                message: "The user is shipper now",
                user
              });
            })
            .catch(err => res.status(400).json(err));
        });
      }
    });
  }

  function deactivateShipper() {
    User.findOneAndUpdate(
      { _id: shipperId },
      { $set: { isShipper: false } },
      { new: true, useFindAndModify: false }
    ).then(user => {
      Shipper.findOneAndUpdate(
        { user: shipperId },
        { $set: { isActiveShipper: false } },
        { new: true, useFindAndModify: false }
      ).then(shipper => {
        res.status(200).json({
          message: "User isn't shipper anymore",
          user
        });
      });
    });
  }
};

exports.addShipperInfo = (req, res) => {
  let shipperId = req.body.shipperId;

  let shipperArea = req.body.area;
  let shipperPhone = req.body.phone;
  let shipperCompany = req.body.company;

  Shipper.findByIdAndUpdate(
    shipperId,
    {
      $set: { area: shipperArea, company: shipperCompany, phone: shipperPhone }
    },
    { new: true, useFindAndModify: false }
  )
    .populate("user")
    .exec((err, shipper) => {
      if (err) {
        res.status(400).json({ message: "Couldn't update shipper", err });
      } else {
        res.status(200).json({ message: "Updated Info", shipper });
      }
    });
};

exports.addAdmin = (req, res) => {
  let adminId = req.body.adminId;
  let isAdmin = req.body.isAdmin; 

  if (isAdmin == "true") {
    User.findOneAndUpdate(
      { _id: adminId },
      { $set: { isAdmin: true } },
      { new: true, useFindAndModify: false }
    ).then(user => {
      res.status(200).json({
        message: "Added as admin",
        user
      });
    });
  } else {
    User.findOneAndUpdate(
      { _id: adminId },
      { $set: { isAdmin: false } },
      { new: true, useFindAndModify: false }
    ).then(user => {
      res.status(200).json({
        message: "Admin is removed",
        user
      });
    });
  }
};

exports.restrictUser = (req, res) => {
  let userId = req.body.userId;
  let isRestricted = req.body.isRestricted; 

  if (isRestricted == "true") {
    User.findOneAndUpdate(
      { _id: userId },
      { $set: { isRestricted: true } },
      { new: true, useFindAndModify: false }
    ).then(user => {
      res.status(200).json({
        message: "User Restricted",
        user
      });
    });
  } else {
    User.findOneAndUpdate(
      { _id: userId },
      { $set: { isRestricted: false } },
      { new: true, useFindAndModify: false }
    ).then(user => {
      res.status(200).json({
        message: "User is un Restricted",
        user
      });
    });
  }
};
