"use strict";

const mongoose = require("mongoose");

// Import all models to ensure they are registered
require("./User"); // User model
require("./Brand"); // Brand model
require("./category"); // Category model
require("./product"); // Product model
require("./firm"); // Firm model
require("./token"); // Token model
// Add other models as needed

// Optional: Log registered models for verification
console.log("Registered models:", mongoose.modelNames());

module.exports = mongoose;
