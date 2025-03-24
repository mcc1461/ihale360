"use strict";
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const { dbConnection } = require("./src/configs/dbConnection");

// Import routes
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const firmRoutes = require("./src/routes/firmRoutes"); // Adjust as necessary
const brandRoutes = require("./src/routes/brandRoutes"); // Adjust as necessary
const categoryRoutes = require("./src/routes/categoryRoutes"); // Adjust as necessary

// Import middlewares
const authenticate = require("./src/middlewares/authentication");
const findSearchSortPage = require("./src/middlewares/findSearchSortPage"); // If applicable
const errorHandler = require("./src/middlewares/errorHandler");

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 8061;

// Handle async errors
require("express-async-errors");

// Connect to the database
dbConnection();

// **Import all models to ensure they are registered**
require("./src/models"); // This imports src/models/index.js

/* ------------------------------------------------------- */
// Middlewares:

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:3061", // Frontend origin
      "http://127.0.0.1:3061",
      "https://tailwindui.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests for all routes
app.options("*", cors());

// Serve static files (e.g., CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Accept JSON and URL Encoded Requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ------------------------------------------------------- */
// Routes:

// Authentication Routes
app.use("/auth", authRoutes); // Mounted at /auth

// User Routes
app.use("/api/users", userRoutes);

// Product Routes
app.use("/api/products", productRoutes);

// Firm Routes
app.use("/api/firms", firmRoutes); // Mount Firm Routes

// Brand Routes
app.use("/api/brands", brandRoutes); // Mount Brand Routes

// Category Routes
app.use("/api/categories", categoryRoutes); // Mount Category Routes

// Example Protected Route
app.get("/api/protected", authenticate, (req, res) => {
  res.status(200).json({
    message: "This is a protected route.",
    user: req.user,
  });
});

// Home Route
app.get("/", (req, res) => {
  res.json({ message: "Hello MusCo" });
});

/* ------------------------------------------------------- */
// Middleware for findSearchSortPage (if applicable)
app.use(findSearchSortPage); // Ensure this middleware doesn't interfere with auth

/* ------------------------------------------------------- */
// Error Handler Middleware
app.use(errorHandler);

/* ------------------------------------------------------- */
// 404 Handler
app.use((req, res) => {
  res.status(404).json({ msg: "Not found" });
});

/* ------------------------------------------------------- */
// Run Server
app.listen(PORT, HOST, () =>
  console.log(`Server running at http://${HOST}:${PORT}`)
);

// Uncomment for production sync
// if (process.env.NODE_ENV === "production") {
//   require("./src/configs/sync")();
// }
