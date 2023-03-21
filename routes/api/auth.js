const express = require("express");
const authController = require("../../controllers/authController");
const { auth } = require("../../middlewares");

const router = express.Router();

router.post("/users/register", authController.register);

router.post("/users/login", authController.login);

router.get("/users/logout", auth, authController.logout);

router.get("/users/current", auth, authController.getCurrentUser);

module.exports = router;
