"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false, // Exclude password from queries by default
    },
    role: {
      type: String,
      enum: ["user", "staff", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
      select: false,
    },
    // Add other fields as necessary
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get signed JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

// Prevent model overwrite by checking if it already exists
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
