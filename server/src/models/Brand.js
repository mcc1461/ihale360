"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
const mongoose = require("mongoose");
/* ------------------------------------------------------- *
{
    "name": "Brand 1",
    "image": "http://imageURL"
}
/* ------------------------------------------------------- */
// Brand Model:

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    image: {
      // URL
      type: String,
      trim: true,
      default: "",
    },
  },
  { collection: "brands", timestamps: true }
);

// Prevent model overwrite by checking if it already exists
const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);

/* ------------------------------------------------------- */
module.exports = Brand;
