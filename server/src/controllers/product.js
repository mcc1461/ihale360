// backend/controllers/product.js

"use strict";

const Product = require("../models/Product"); // Ensure correct path and case

module.exports = {
  list: async (req, res) => {
    try {
      const products = await Product.find(); // Populates handled by pre 'find' middleware
      const total = await Product.countDocuments();

      res.status(200).send({
        error: false,
        details: { total },
        data: products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send({
        error: true,
        message: "Error fetching products",
      });
    }
  },

  create: async (req, res) => {
    try {
      const data = await Product.create(req.body);
      res.status(201).send({
        error: false,
        data,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).send({
        error: true,
        message: "Error creating product",
      });
    }
  },

  read: async (req, res) => {
    try {
      const data = await Product.findById(req.params.id);
      if (!data) {
        return res.status(404).send({
          error: true,
          message: "Product not found",
        });
      }
      res.status(200).send({
        error: false,
        data,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).send({
        error: true,
        message: "Error fetching product",
      });
    }
  },

  update: async (req, res) => {
    try {
      const data = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!data) {
        return res.status(404).send({
          error: true,
          message: "Product not found",
        });
      }
      res.status(200).send({
        error: false,
        data,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send({
        error: true,
        message: "Error updating product",
      });
    }
  },

  delete: async (req, res) => {
    try {
      const data = await Product.findByIdAndDelete(req.params.id);
      if (!data) {
        return res.status(404).send({
          error: true,
          message: "Product not found",
        });
      }
      res.status(204).send(); // 204 No Content
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).send({
        error: true,
        message: "Error deleting product",
      });
    }
  },
};
