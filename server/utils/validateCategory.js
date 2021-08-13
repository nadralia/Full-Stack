const { body, validationResult } = require("express-validator");

exports.validateAdd = [
  body("name")
    .isLength({ min: 2 })
    .withMessage("Must be at least 2 letters")
    .trim()
    .escape(),

  body("description")
    .isLength({ min: 10 })
    .withMessage("Must be at least 10 letters")
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

exports.validateUpdate = [
  body("name")
    .isLength({ min: 2 })
    .withMessage("must be at least 2 letters")
    .trim()
    .escape(),
  body("description")
    .isLength({ min: 10 })
    .withMessage("must be at least 10 letters")
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
