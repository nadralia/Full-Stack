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

exports.editUser = (req, res) => {
  User.findById(req.user.id, (err, userToUpdate) => {
    if (err) {
      res.status(400).json({ message: "Error getting user try gain" });
    } else {
      let updatedUser = {
        password: req.body.password ? req.body.password : userToUpdate.password,
        firstName: req.body.firstName ? req.body.firstName : userToUpdate.firstName,
        lastName: req.body.lastName ? req.body.lastName : userToUpdate.lastName,
        email: req.body.email ? req.body.email : userToUpdate.email,
        gender: req.body.gender ? req.body.gender : userToUpdate.gender,
        nationality: req.body.nationality
          ? req.body.nationality
          : userToUpdate.nationality,
        birthDate: req.body.birthDate ? req.body.birthDate : userToUpdate.birthDate,
        isSeller: req.body.isSeller ? req.body.isSeller : userToUpdate.isSeller
      };

      if (userToUpdate.email === req.body.email) {
        User.findOne({ username: req.body.username }, (err, userWithSameUsername) => {
          if (err) {
            res.status(400).json({
              message: "Error getting username"
            });
          } else if (userWithSameUsername) {
            res.status(400).json({
              message: "Username is taken"
            });
          } else {

            if (req.body.password !== req.body.verifyPassword) {
              return res.status(400).json({ message: "Password doesn't match" });
            }
            bcrypt.genSalt(10, (err, salt) => {
              if (err) throw err;
              if (req.body.password === "") {
                User.findByIdAndUpdate(req.user.id, updatedUser, {
                  new: true,
                  useFindAndModify: false
                })
                  .select("-password")
                  .then(user => {
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
                        res.status(200).json({
                          token,
                          message: "Account settings updated",
                          user
                        });
                      }
                    );
                  })
                  .catch(err => {
                    res.status(400).json({
                      message: "Couldn't update",
                      err
                    });
                  });
              } else {
                bcrypt.hash(updatedUser.password, salt, (err, hash) => {
                  if (err) throw err;

                  updatedUser.password = hash;

                  User.findByIdAndUpdate(req.user.id, updatedUser, {
                    new: true,
                    useFindAndModify: false
                  })
                    .select("-password")
                    .then(user => {
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
                          res.status(200).json({
                            token,
                            message: "Account settings updated",
                            user
                          });
                        }
                      );
                    })
                    .catch(err => {
                      res.status(400).json({
                        message: "Couldn't update",
                        err
                      });
                    });
                });
              }
            });
          }
        });
      } else {
        if (req.body.password !== req.body.verifyPassword) {
          return res.status(400).json({ message: "Password doesn't match" });
        }
        User.findOne({ email: req.body.email }, (err, userWithSameEmail) => {
          if (err) {
            res.status(400).json({
              message: "Error getting email try gain"
            });
          } else if (userWithSameEmail) {
            res.status(400).json({ message: "This email is taken" });
          } else {
            User.findOne({ username: req.body.username }, (err, userWithSameUsername) => {
              if (err) {
                res.status(400).json({
                  message: "Error getting username"
                });
              } else if (userWithSameUsername) {
                res.status(400).json({ message: "Username is taken" });
              } else {
                bcrypt.genSalt(10, (err, salt) => {
                  if (err) throw err;

                  if (req.body.password === "") {
                    User.findByIdAndUpdate(req.user.id, updatedUser, {
                      new: true,
                      useFindAndModify: false
                    })
                      .select("-password")
                      .then(user => {
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
                            res.status(200).json({
                              token,
                              message: "Account settings updated",
                              user
                            });
                          }
                        );
                      })
                      .catch(err => {
                        res.status(400).json({
                          message: "Couldn't update",
                          err
                        });
                      });
                  } else {
                    bcrypt.hash(updatedUser.password, salt, (err, hash) => {
                      if (err) throw err;

                      updatedUser.password = hash;

                      User.findByIdAndUpdate(req.user.id, updatedUser, {
                        new: true,
                        useFindAndModify: false
                      })
                        .select("-password")
                        .then(user => {
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
                              res.status(200).json({
                                token,
                                message: "Account settings updated",
                                user
                              });
                            }
                          );
                        })
                        .catch(err => {
                          res.status(400).json({
                            message: "Couldn't update",
                            err
                          });
                        });
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
  });
};

