// src/middlewares/authentication.js

"use strict";

const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure correct path and case
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const JWT_SECRET = process.env.JWT_SECRET || "Mcc_JWT_SECRET";

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authenticate;
