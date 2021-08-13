const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const users_controller = require("../controllers/user.controller");
const users_validation = require("../utils/validateUser");


router.post("/signup", users_validation.validateRegister, users_controller.createUser);
router.post("/login", users_validation.validateLogin, users_controller.login);
router.get("/user", auth, users_controller.getUser);

router.put(
    "/edit_account",
    auth,
    users_validation.validateEditUser,
    users_controller.editUser
);
  

module.exports = router;
