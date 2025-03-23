"use strict";

const router = require("express").Router();
const firmController = require("../controllers/firm");
const authenticate = require("../middlewares/authentication"); // Import authenticate middleware

// Apply authentication middleware to all routes in this router
router.use(authenticate);

// Define Routes

// GET /api/firms - List all firms
router.get("/", firmController.list);

// POST /api/firms - Create a new firm
router.post("/", authenticate, firmController.create);

// GET /api/firms/:id - Get a single firm by ID
router.get("/:id", authenticate, firmController.read);

// PUT /api/firms/:id - Update a firm by ID
router.put("/:id", authenticate, firmController.update);

// DELETE /api/firms/:id - Delete a firm by ID
router.delete("/:id", authenticate, firmController.delete);

module.exports = router;
