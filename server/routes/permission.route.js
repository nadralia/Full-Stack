const express = require("express");
const router = express.Router();
const { auth, adminAuth } = require("../middleware/auth");
const permissions_controller = require("../controllers/permission.controller");

router.get("/allUsers", auth, adminAuth, permissions_controller.getAllUsers);
router.get("/allShippers", auth, adminAuth, permissions_controller.getAllShippers);
router.put("/addShipper", auth, adminAuth, permissions_controller.addShipper);
router.put("/addShipperInfo", auth, adminAuth, permissions_controller.addShipperInfo);
router.put("/addAdmin", auth, adminAuth, permissions_controller.addAdmin);
router.put("/restrictUser", auth, adminAuth, permissions_controller.restrictUser);

module.exports = router;
