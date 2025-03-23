"use strict";

const router = require("express").Router();
const brandController = require("../controllers/brand");
const authenticate = require("../middlewares/authentication"); // Import authenticate middleware

// Apply authentication middleware to all routes in this router
router.use(authenticate);

// Define Routes

// GET /api/brands - List all brands
router.get("/", brandController.list);

// POST /api/brands - Create a new brand
router.post("/", authenticate, brandController.create);

// GET /api/brands/:id - Get a single brand by ID
router.get("/:id", authenticate, brandController.read);

// PUT /api/brands/:id - Update a brand by ID
router.put("/:id", authenticate, brandController.update);

// DELETE /api/brands/:id - Delete a brand by ID
router.delete("/:id", authenticate, brandController.delete);

module.exports = router;
