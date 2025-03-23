"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
const mongoose = require("mongoose");
/* ------------------------------------------------------- *
{
    "name": "Category 1"
}
/* ------------------------------------------------------- */
// Category Model:

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
  },
  { collection: "categories", timestamps: true }
);

// Prevent model overwrite by checking if it already exists
const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

/* ------------------------------------------------------- */
module.exports = Category;
