const { body, validationResult } = require("express-validator");

exports.validateAdd = [
  body("firstName")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 charachers")
    .trim()
    .escape(),
  body("lastName")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 charachers")
    .trim()
    .escape(),
  body("address1")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 charachers")
    .trim()
    .escape(),
  body("address2").optional().trim().escape(),
  body("country")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("state")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("city")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("street")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("building").optional().trim().escape(),
  body("floor").optional().trim().escape(),
  body("apartment").optional().trim().escape(),
  body("phoneNumber")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("postalCode")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("isPrimary")
    .optional()
    .isBoolean()
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
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
  body("firstName")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 charachers")
    .trim()
    .escape(),
  body("lastName")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 charachers")
    .trim()
    .escape(),
  body("address1")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 charachers")
    .trim()
    .escape(),
  body("address2").optional().trim().escape(),
  body("country")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("state")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("city")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("street")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("building").optional().trim().escape(),
  body("floor").optional().trim().escape(),
  body("apartment").optional().trim().escape(),
  body("phoneNumber")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("postalCode")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("isPrimary")
    .optional()
    .isBoolean()
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
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
