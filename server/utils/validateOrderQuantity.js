const { body, validationResult } = require("express-validator");

exports.validateOrderQuantity = [
  body("orderQuantity")
    .isNumeric()
    .isInt({ gt: 0 })
    .withMessage("must be more than 0")
    .isLength({
      min: 1
    })
    .withMessage("must be at least 1 charachers")
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
