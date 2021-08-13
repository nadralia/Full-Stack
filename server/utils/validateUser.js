const { body, validationResult } = require("express-validator");

exports.validateRegister = [
  body("username")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 charachers")
    .trim()
    .escape(),
  body("password")
    .isLength({
      min: 8
    })
    .withMessage("must be at least 8 characters")
    .trim()
    .escape(),
  body("firstName").isLength({
    min: 2
  }),
  body("lastName")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("email").isEmail().withMessage("isn't vaild").trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let field = errors.errors[0].param;
      let message = errors.errors[0].msg;
      let errorMessage = field + " " + message;

      res.status(400).json({
        message: errorMessage,
        errors: errors
      });
    } else {
      next();
    }
  }
];


exports.validateLogin = [
  body("username")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 charachers")
    .trim()
    .escape(),
  body("password")
    .isLength({
      min: 8
    })
    .withMessage("must be at least 8 characters")
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let field = errors.errors[0].param;
      let message = errors.errors[0].msg;
      let errorMessage = field + " " + message;

      res.status(400).json({
        message: errorMessage,
        errors: errors
      });
    } else {
      next();
    }
  }
];

exports.validateEditUser = [
  body("password").optional().trim().escape(),
  body("firstName")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("lastName")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("email").isEmail().withMessage("isn't vaild").trim().escape(),
  body("gender").optional().trim().escape(),
  body("nationality").optional().trim().escape(),
  body("birthDate").optional().trim().escape(),
  body("isSeller").optional().isBoolean().trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let field = errors.errors[0].param;
      let message = errors.errors[0].msg;
      let errorMessage = field + " " + message;

      res.status(400).json({
        message: errorMessage,
        errors: errors
      });
    } else {
      next();
    }
  }
];
