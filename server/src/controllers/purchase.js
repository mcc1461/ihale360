"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
// Purchase Controller:

const Product = require("../models/Product");
const Purchase = require("../models/Purchase");
const User = require("../models/User"); // Ensure User model is imported

module.exports = {
  // List Purchases
  list: async (req, res) => {
    try {
      const purchases = await Purchase.find()
        .populate("firmId", "name")
        .populate("brandId", "name")
        .populate("categoryId", "name")
        .populate("productId", "name")
        .populate("purchasedById", "username role");

      res.status(200).json({
        error: false,
        data: purchases,
      });
    } catch (error) {
      console.error("Error fetching purchases:", error);
      res.status(500).json({ error: true, message: "Server error." });
    }
  },

  // Create Purchase
  create: async (req, res) => {
    try {
      const currentUserRole = req.user.role;
      const currentUserId = req.user._id.toString();

      const {
        date,
        firmId,
        brandId,
        categoryId,
        productId,
        purchasedById,
        quantity,
        price,
        notes,
      } = req.body;

      // Ensure required fields are provided
      if (
        !firmId ||
        !brandId ||
        !categoryId ||
        !productId ||
        !purchasedById ||
        quantity == null ||
        price == null
      ) {
        return res
          .status(400)
          .json({ error: true, message: "Missing required fields." });
      }

      // Fetch the purchasedBy user
      const purchasedByUser = await User.findById(purchasedById);
      if (!purchasedByUser) {
        return res
          .status(400)
          .json({ error: true, message: "Invalid purchasedById." });
      }

      // Validate based on current user's role
      let allowedRoles = [];

      if (currentUserRole === "admin") {
        // Admin can select any user
        allowedRoles = ["admin", "staff", "user"];
      } else if (currentUserRole === "staff") {
        // Staff can select staff and users
        allowedRoles = ["staff", "user"];
      } else {
        // Regular users can only select themselves
        if (purchasedById !== currentUserId) {
          return res.status(403).json({
            error: true,
            message: "You can only select yourself as 'Purchased By'.",
          });
        }
        allowedRoles = ["user"];
      }

      // Check if the purchasedByUser's role is in allowedRoles
      const purchasedByUserRole = purchasedByUser.role || "user"; // Default to 'user' if role is undefined
      if (!allowedRoles.includes(purchasedByUserRole)) {
        return res.status(403).json({
          error: true,
          message: "You are not authorized to select this user.",
        });
      }

      // Proceed to create the purchase
      const newPurchase = new Purchase({
        date,
        firmId,
        brandId,
        categoryId,
        productId,
        purchasedById,
        quantity,
        price,
        notes,
      });

      const savedPurchase = await newPurchase.save();

      // Update the product's quantity
      await Product.findByIdAndUpdate(productId, {
        $inc: { quantity: quantity },
      });

      res.status(201).json({
        error: false,
        data: savedPurchase,
      });
    } catch (error) {
      console.error("Error creating purchase:", error);
      res.status(500).json({ error: true, message: "Server error." });
    }
  },

  // Read Single Purchase
  read: async (req, res) => {
    try {
      const purchaseId = req.params.id;

      const purchase = await Purchase.findById(purchaseId)
        .populate("firmId", "name")
        .populate("brandId", "name")
        .populate("categoryId", "name")
        .populate("productId", "name")
        .populate("purchasedById", "username role");

      if (!purchase) {
        return res
          .status(404)
          .json({ error: true, message: "Purchase not found." });
      }

      res.status(200).json({
        error: false,
        data: purchase,
      });
    } catch (error) {
      console.error("Error reading purchase:", error);
      res.status(500).json({ error: true, message: "Server error." });
    }
  },

  // Update Purchase
  update: async (req, res) => {
    try {
      const purchaseId = req.params.id;
      const updateData = req.body;

      // Find the existing purchase
      const currentPurchase = await Purchase.findById(purchaseId);

      if (!currentPurchase) {
        return res
          .status(404)
          .json({ error: true, message: "Purchase not found." });
      }

      // Calculate quantity difference
      let quantityDifference = 0;
      if (updateData.quantity != null) {
        quantityDifference = updateData.quantity - currentPurchase.quantity;
      }

      // Update the purchase
      const updatedPurchase = await Purchase.findByIdAndUpdate(
        purchaseId,
        updateData,
        { new: true, runValidators: true }
      );

      // Update the product's quantity if quantity has changed
      if (quantityDifference !== 0) {
        await Product.findByIdAndUpdate(currentPurchase.productId, {
          $inc: { quantity: quantityDifference },
        });
      }

      res.status(200).json({
        error: false,
        data: updatedPurchase,
      });
    } catch (error) {
      console.error("Error updating purchase:", error);
      res.status(500).json({ error: true, message: "Server error." });
    }
  },

  // Delete Purchase
  delete: async (req, res) => {
    try {
      const purchaseId = req.params.id;

      // Find the purchase to delete
      const purchaseToDelete = await Purchase.findById(purchaseId);

      if (!purchaseToDelete) {
        return res
          .status(404)
          .json({ error: true, message: "Purchase not found." });
      }

      // Delete the purchase
      await Purchase.findByIdAndDelete(purchaseId);

      // Update the product's quantity
      await Product.findByIdAndUpdate(purchaseToDelete.productId, {
        $inc: { quantity: -purchaseToDelete.quantity },
      });

      res.status(200).json({
        error: false,
        message: "Purchase deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting purchase:", error);
      res.status(500).json({ error: true, message: "Server error." });
    }
  },
};
