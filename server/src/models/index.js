"use strict";

const mongoose = require("mongoose");

// Import all models to ensure they are registered
require("./User"); // User model
require("./Brand"); // Brand model
require("./Category"); // Category model
require("./Product"); // Product model
require("./Firm"); // Firm model
require("./Token"); // Token model
// Add other models as needed

// Optional: Log registered models for verification
console.log("Registered models:", mongoose.modelNames());

module.exports = mongoose;
