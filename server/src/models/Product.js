// src/models/Product.js

"use strict";

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand", // Ensure this matches the Brand model name exactly
      required: [true, "Please add a brand"],
    },
    categoryId: {
      // Renamed from 'category' to 'categoryId' for consistency
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Ensure this matches the Category model name exactly
      required: [true, "Please add a category"],
    },
    // Add other fields as necessary
  },
  { timestamps: true }
);

// Pre 'find' middleware to auto-populate brandId and categoryId
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "brandId",
    select: "name", // Select specific fields from Brand
  }).populate({
    path: "categoryId",
    select: "name", // Select specific fields from Category
  });
  next();
});

// Prevent model overwrite by checking if it already exists
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
