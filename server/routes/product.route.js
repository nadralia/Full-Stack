const express = require("express");
const router = express.Router();
const product_controller = require("../controllers/product.controller");
const product_validation = require("../utils/validateProduct");
const handle_images = require("../middleware/handleImageMulter");
const { auth, sellerAuth } = require("../middleware/auth");


router.get("/", product_controller.allProducts);
router.get("/my_products", auth, product_controller.userProducts);
router.post(
  "/create",
  auth,
  sellerAuth,
  handle_images.productImages(),
  product_validation.validateAdd,
  product_controller.createProduct
);

router.get("/:id", product_controller.productDetails);
router.delete("/:id/delete", auth, sellerAuth, product_controller.deleteProduct);
router.post(
  "/:id/update",
  auth,
  sellerAuth,
  handle_images.productImages(),
  product_validation.validateUpdate,
  product_controller.updateProduct
);

module.exports = router;