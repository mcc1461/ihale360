// src/routes/authRoutes.js

"use strict";

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { body } = require("express-validator");

// POST /auth/login
router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.loginUser
);

// POST /auth/register
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  authController.registerUser
);

// POST /auth/refresh-token
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
