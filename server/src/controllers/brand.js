// backend/controllers/brand.js
"use strict";

const Brand = require("../models/Brand");

module.exports = {
  list: async (req, res) => {
    try {
      // Filtreleme, arama, sıralama ve sayfalama için query parametrelerini işleyebilirsiniz
      // Şu an basit bir listeleme yapıyoruz:
      const brands = await Brand.find();
      const total = await Brand.countDocuments();

      res.status(200).send({
        error: false,
        details: { total },
        data: brands,
      });
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).send({
        error: true,
        message: "Error fetching brands",
      });
    }
  },

  create: async (req, res) => {
    try {
      const data = await Brand.create(req.body);
      res.status(201).send({
        error: false,
        data,
      });
    } catch (error) {
      console.error("Error creating brand:", error);
      res.status(500).send({
        error: true,
        message: "Error creating brand",
      });
    }
  },

  read: async (req, res) => {
    try {
      const data = await Brand.findOne({ _id: req.params.id });
      if (!data) {
        return res.status(404).send({
          error: true,
          message: "Brand not found",
        });
      }
      res.status(200).send({
        error: false,
        data,
      });
    } catch (error) {
      console.error("Error fetching brand:", error);
      res.status(500).send({
        error: true,
        message: "Error fetching brand",
      });
    }
  },

  update: async (req, res) => {
    try {
      const data = await Brand.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!data) {
        return res.status(404).send({
          error: true,
          message: "Brand not found",
        });
      }
      res.status(200).send({
        error: false,
        data,
      });
    } catch (error) {
      console.error("Error updating brand:", error);
      res.status(500).send({
        error: true,
        message: "Error updating brand",
      });
    }
  },

  delete: async (req, res) => {
    try {
      const data = await Brand.findByIdAndDelete(req.params.id);
      if (!data) {
        return res.status(404).send({
          error: true,
          message: "Brand not found",
        });
      }
      res.status(204).send(); // 204 No Content
    } catch (error) {
      console.error("Error deleting brand:", error);
      res.status(500).send({
        error: true,
        message: "Error deleting brand",
      });
    }
  },
};
