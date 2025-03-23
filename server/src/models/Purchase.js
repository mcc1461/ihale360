"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
const mongoose = require("mongoose");

/* ------------------------------------------------------- */
// Purchase Model:

const purchaseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    firmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Firm",
      required: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productImageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    purchasedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { collection: "purchases", timestamps: true }
);

/* Pre-save hook to calculate the amount */
PurchaseSchema.pre("save", function (next) {
  this.amount = this.price * this.quantity;
  next();
});

/* Pre-update hook to recalculate the amount */
PurchaseSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.price != null && update.quantity != null) {
    update.amount = update.price * update.quantity;
  }
  next();
});

// Prevent model overwrite by checking if it already exists
const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
