"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
const mongoose = require("mongoose");
/* ------------------------------------------------------- *
{
  "userId": "65343222b67e9681f937f001",
  "token": "...tokenKey..."
}
/* ------------------------------------------------------- */
// Token Model:

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    token: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
  },
  { collection: "tokens", timestamps: true }
);

/* ------------------------------------------------------- */

// Prevent model overwrite by checking if it already exists
const Token = mongoose.models.Token || mongoose.model("Token", tokenSchema);

module.exports = Token;
