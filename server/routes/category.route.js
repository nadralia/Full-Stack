const express = require("express");
const router = express.Router();
const category_controller = require("../controllers/category.controller");
const category_validation = require("../utils/validateCategory");
const { auth, adminAuth, sellerAuth } = require("../middleware/auth");


router.get("/", category_controller.categoryIndex);

router.post(
  "/create",
  auth,
  sellerAuth,
  category_validation.validateAdd,
  category_controller.createCategory
);

router.get("/:id", category_controller.categoryDetails);
router.delete("/:id/delete", auth, adminAuth, category_controller.deleteCategory);
router.put(
  "/:id/update",
  auth,
  adminAuth,
  category_validation.validateUpdate,
  category_controller.updateCategory
);

module.exports = router;
