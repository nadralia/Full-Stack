const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;


exports.getUser = (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(user => res.json(user));
};

exports.login = (req, res) => {
  const generateNewToken = (user) => {
    jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
        isCustomer: user.isCustomer,
        isShipper: user.isShipper,
        isRestricted: user.isRestricted
      },
      jwtSecret,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) res.json({ err });
        else {
          res.json({
            token,
            message: "Logged in Succefully",
            user: {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              gender: user.gender,
              nationality: user.nationality,
              birthDate: user.birthDate,
              creationDate: user.creationDate,
              isAdmin: user.isAdmin,
              isSeller: user.isSeller,
              isCustomer: user.isCustomer,
              isShipper: user.isShipper,
              isRestricted: user.isRestricted
            }
          });
        }
      }
    );
  }

  const checkIfPasswordMatch = (user) => {
    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid password"
        });
      } else {
        generateNewToken(user);
      }
    });
  }

  User.findOne({ username: req.body.username }).exec((err, foundUser) => {
    if (err) {
      res.json(err);
    }
    if (!foundUser) {
      res.status(400).json({ message: "Invalid username" });
    }
    else {
      checkIfPasswordMatch(foundUser);
    }
  });
};


exports.createUser = (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    isAdmin: false,
    isSeller: false,
    isCustomer: true,
    isShipper: false,
    isRestricted: false
  });

  // generate and json token and send it with the user
  const generateNewToken = (user) => {
    jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
        isCustomer: user.isCustomer,
        isShipper: user.isShipper,
        isRestricted: user.isRestricted
      },
      jwtSecret,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        else
          res.json({
            token,
            message: "Registered Succefully",
            user: {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              gender: user.gender,
              nationality: user.nationality,
              birthDate: user.birthDate,
              creationDate: user.creationDate,
              isAdmin: user.isAdmin,
              isSeller: user.isSeller,
              isCustomer: user.isCustomer,
              isShipper: user.isShipper,
              isRestricted: user.isRestricted,
              cart: user.cart,
              wishList: user.cart
            }
          });
      }
    );
  }

  const encryptPasswordAndSave = () => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => {
            generateNewToken(user);
          })
          .catch(err => {
            res.status(400).json({
              message: "Error registering",
              err
            });
          });
      });
    });
  };

  const verifyPassword = () => {
    if (req.body.password !== req.body.verifyPassword) {
      res.status(400).json({
        message: "Passwords don't match"
      });
    } else {
      encryptPasswordAndSave();
    }
  }

  const checkUsernameExists = () => {
    User.findOne({ email: req.body.email }, (err, userWithSameEmail) => {
      if (err) {
        res.status(400).json({
          message: "No user exists with this email"
        });
      } else if (userWithSameEmail) {
        res.status(400).json({ message: "This email is already" });
      } else {
        verifyPassword();
      }
    });
  }

  checkUsernameExists();
};


