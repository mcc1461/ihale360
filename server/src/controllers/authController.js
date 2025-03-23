// src/controllers/authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Ensure correct case
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const JWT_SECRET = process.env.JWT_SECRET || "Mcc_JWT_SECRET";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "Mcc_REFRESH_SECRET";

// Helper function to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      _id: user._id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" } // Access token expires in 7 days
  );

  const refreshToken = jwt.sign(
    {
      _id: user._id,
    },
    REFRESH_SECRET,
    { expiresIn: "15d" } // Refresh token expires in 15 days
  );

  return { accessToken, refreshToken };
};

// Refresh Token Controller
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(400)
      .json({ error: true, message: "Refresh token is required." });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    // Find user by ID and validate refresh token
    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid refresh token." });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Update user's refresh token in the database
    user.refreshToken = newRefreshToken;
    await user.save();

    // Respond with new tokens and user info
    return res.status(200).json({
      bearer: {
        accessToken,
        refreshToken: newRefreshToken,
      },
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      error: false,
      message: "Token refreshed successfully.",
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res
      .status(401)
      .json({ error: true, message: "Invalid or expired refresh token." });
  }
};

// Login Controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        error: true,
        message: "Username and password are required.",
      });
    }

    // Find user by username and include password
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials.",
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refreshToken in user model
    user.refreshToken = refreshToken;
    await user.save();

    // Return user data and tokens
    return res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      bearer: {
        accessToken,
        refreshToken,
      },
      error: false,
      message: "Login successful.",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: true,
      message: "Server error.",
    });
  }
};

// Register Controller
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        error: true,
        message: "Username, email, and password are required.",
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: "Username is already taken.",
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refreshToken in user model
    user.refreshToken = refreshToken;
    await user.save();

    // Return user data and tokens
    return res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      bearer: {
        accessToken,
        refreshToken,
      },
      error: false,
      message: "User created.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      error: true,
      message: "Server error.",
    });
  }
};

// Logout Controller
const logout = async (req, res) => {
  try {
    const { token } = req.body;

    // Validate input
    if (!token) {
      return res.status(400).json({
        error: true,
        message: "Token is required.",
      });
    }

    // Verify token
    jwt.verify(token, REFRESH_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).json({
          error: true,
          message: "Invalid token.",
        });
      }

      // Find user by id
      const existingUser = await User.findById(user._id);
      if (!existingUser) {
        return res.status(404).json({
          error: true,
          message: "User not found.",
        });
      }

      // Remove refreshToken from user model
      existingUser.refreshToken = "";
      await existingUser.save();

      // Return success message
      return res.status(200).json({
        error: false,
        message: "Logout successful.",
      });
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      error: true,
      message: "Server error.",
    });
  }
};

// Export the controllers
module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logout,
};
