// src/routes/productRoutes.js

"use strict";

const express = require("express");
const router = express.Router();
const productController = require("../controllers/product"); // Ensure correct path and case
const authenticate = require("../middlewares/authentication");

// Debugging: Verify controller functions are imported correctly
console.log("Product Controller:", productController);

// Define Routes

// GET /api/products - List all products
router.get("/", productController.list);

// POST /api/products - Create a new product
router.post("/", authenticate, productController.create);

// GET /api/products/:id - Get a single product by ID
router.get("/:id", authenticate, productController.read);

// PUT /api/products/:id - Update a product by ID
router.put("/:id", authenticate, productController.update);

// DELETE /api/products/:id - Delete a product by ID
router.delete("/:id", authenticate, productController.delete);

module.exports = router;
