"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */

const mongoose = require("mongoose");

/* ------------------------------------------------------- *
{
    "name": "Firm 1",
    "phone": "999 88 77",
    "address": "Address",
    "image": "http://imageURL"
}
/* ------------------------------------------------------- */

// Firm Model:

const firmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    image: {
      // URL
      type: String,
      trim: true,
      default: "",
    },
  },
  { collection: "Firms", timestamps: true }
);

// Prevent model overwrite by checking if it already exists
const Firm = mongoose.models.Firm || mongoose.model("Firm", firmSchema);

module.exports = Firm;
