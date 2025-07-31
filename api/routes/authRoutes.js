const express = require("express");
const router = express.Router();
const { register, login, profile, logout,googleLogin } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", profile);
router.post("/logout", logout);
router.post("/google-login", googleLogin);

module.exports = router;
