"use strict";

const router = require("express").Router();
const categoryController = require("../controllers/category");
const authenticate = require("../middlewares/authentication"); // Import authenticate middleware

// Apply authentication middleware to all routes in this router
router.use(authenticate);

// Define Routes

// GET /api/categories - List all categories
router.get("/", categoryController.list);

// POST /api/categories - Create a new category
router.post("/", authenticate, categoryController.create);

// GET /api/categories/:id - Get a single category by ID
router.get("/:id", authenticate, categoryController.read);

// PUT /api/categories/:id - Update a category by ID
router.put("/:id", authenticate, categoryController.update);

// DELETE /api/categories/:id - Delete a category by ID
router.delete("/:id", authenticate, categoryController.delete);

module.exports = router;
