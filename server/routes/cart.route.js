const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const cart_controller = require("../controllers/cart.controller");
const cart_validation = require("../utils/validateOrderQuantity");

router.put(
  "/addToCart",
  auth,
  cart_validation.validateOrderQuantity,
  cart_controller.addToCart
);

router.get("/userCartInfo", auth, cart_controller.userCartInfo);

router.get("/removeFromCart", auth, cart_controller.removeFromCart);

router.put(
  "/changeQuantityFromCart",
  auth,
  cart_validation.validateOrderQuantity,
  cart_controller.changeQuantityFromCart
);

router.put("/chooseOrderAddress", auth, cart_controller.chooseOrderAddress);

module.exports = router;
