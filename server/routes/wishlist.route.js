const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const wishlist_controller = require("../controllers/wishlist.controller");

router.get("/addToWishlist", auth, wishlist_controller.addToWishlist);
router.get("/userWishlist", auth, wishlist_controller.userWishlist);
router.get("/removeFromWishlist", auth, wishlist_controller.removeFromWishlist);

module.exports = router;
