"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Ensure you have JWT_SECRET in your environment variables
const JWT_SECRET = process.env.JWT_SECRET || "Mcc_JWT_SECRET";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "Mcc_REFRESH_SECRET";

module.exports = {
  // List users (Admin sees all, regular users see only their own profile)
  list: async (req, res) => {
    try {
      // If req.user is undefined (unauthenticated), return an error
      if (!req.user) {
        return res.status(401).json({
          error: true,
          message: "Unauthorized access. Please log in.",
        });
      }

      // Determine filters based on user role
      const filters = req.user.role === "admin" ? {} : { _id: req.user._id };

      // Fetch users from the database
      const data = await User.find(filters).select("-password -__v");

      if (!data || data.length === 0) {
        return res.status(404).json({
          error: true,
          message: "No users found.",
          data: [],
        });
      }

      res.status(200).json({
        error: false,
        data,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: true, message: "Server error." });
    }
  },

  // Create a new user
  create: async (req, res) => {
    try {
      const { username, password, email, firstName, lastName, role } = req.body;

      if (!username || !password || !email || !firstName || !lastName) {
        return res.status(400).json({
          error: true,
          message: "All fields are required.",
        });
      }

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          error: true,
          message: "User already exists.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
        role: role || "user",
      });

      await newUser.save();

      // Generate a token for the new user
      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        JWT_SECRET,
        { expiresIn: "10d" }
      );

      return res.status(201).json({
        token,
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
        error: false,
        message: "User registered successfully.",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: true, message: "Server error." });
    }
  },

  // Read a single user
  read: async (req, res) => {
    try {
      // Ensure the user is authenticated
      if (!req.user) {
        return res.status(401).json({
          error: true,
          message: "Unauthorized access. Please log in.",
        });
      }

      // Admins can read any user; others can read only their own profile
      const filters =
        req.user.role === "admin"
          ? { _id: req.params.id }
          : { _id: req.user._id };

      const data = await User.findOne(filters).select("-password -__v");

      if (!data) {
        return res
          .status(404)
          .json({ error: true, message: "User not found." });
      }

      return res.status(200).json({
        error: false,
        data,
      });
    } catch (error) {
      console.error("Error reading user:", error);
      res.status(500).json({ error: true, message: "Server error." });
    }
  },

  // Update a user's profile
  update: async (req, res) => {
    try {
      // Ensure the user is authenticated
      if (!req.user) {
        return res.status(401).json({
          error: true,
          message: "Unauthorized access. Please log in.",
        });
      }

      // Admins can update any user; others can update only their own profile
      const filters =
        req.user.role === "admin"
          ? { _id: req.params.id }
          : { _id: req.user._id };

      // Prevent regular users from changing their role
      if (req.body.role && req.user.role !== "admin") {
        delete req.body.role;
      }

      const updatedUser = await User.findOneAndUpdate(filters, req.body, {
        new: true,
        runValidators: true,
      }).select("-password -__v");

      if (!updatedUser) {
        return res.status(404).json({
          error: true,
          message: "User not found or no changes made.",
        });
      }

      return res.status(200).json({
        error: false,
        message: "User updated successfully.",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: true, message: "Server error." });
    }
  },

  // Remove (delete) a user
  remove: async (req, res) => {
    try {
      // Ensure the user is authenticated and is an admin
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
          error: true,
          message: "Forbidden: Admin access required.",
        });
      }

      const deletedUser = await User.findOneAndDelete({ _id: req.params.id });

      if (!deletedUser) {
        return res.status(404).json({
          error: true,
          message: "User not found or could not be deleted.",
        });
      }

      return res.status(200).json({
        error: false,
        message: "User deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: true, message: "Server error." });
    }
  },
};
