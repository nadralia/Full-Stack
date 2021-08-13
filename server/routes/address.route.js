const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const address_controller = require("../controllers/address.controller");
const address_validation = require("../utils/validateAddress");

router.post("/", auth, address_validation.validateAdd, address_controller.addAddress);
router.put("/", auth, address_validation.validateUpdate, address_controller.editAddress);
router.delete("/", auth, address_controller.deleteAddress);
router.get("/", auth, address_controller.getAddresses);

module.exports = router;
