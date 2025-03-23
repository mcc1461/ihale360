"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
// Firm Controller:

const Firm = require("../models/Firm");
const formatPhoneNumber = require("../utils/formatPhoneNumber");

module.exports = {
  list: async (req, res) => {
    try {
      const firms = await Firm.find();
      res.status(200).json({
        error: false,
        data: firms,
      });
    } catch (error) {
      console.error("Error fetching firms:", error);
      res.status(500).json({ error: true, message: "Server Error" });
    }
  },

  create: async (req, res) => {
    try {
      if (req.body.phone) {
        req.body.formattedPhone = formatPhoneNumber(req.body.phone); // Add a formattedPhone field
      }

      const newFirm = await Firm.create(req.body);

      res.status(201).json({
        error: false,
        data: newFirm,
      });
    } catch (error) {
      console.error("Error creating firm:", error);
      res.status(500).json({ error: true, message: "Server Error" });
    }
  },

  read: async (req, res) => {
    try {
      const firm = await Firm.findById(req.params.id);
      if (!firm) {
        return res.status(404).json({ error: true, message: "Firm not found" });
      }

      if (firm.phone) {
        firm.formattedPhone = formatPhoneNumber(firm.phone); // Format the phone number for the response
      }

      res.status(200).json({
        error: false,
        data: firm,
      });
    } catch (error) {
      console.error("Error reading firm:", error);
      res.status(500).json({ error: true, message: "Server Error" });
    }
  },

  update: async (req, res) => {
    try {
      if (req.body.phone) {
        req.body.formattedPhone = formatPhoneNumber(req.body.phone); // Add a formattedPhone field
      }

      const updatedFirm = await Firm.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedFirm) {
        return res.status(404).json({ error: true, message: "Firm not found" });
      }

      res.status(200).json({
        error: false,
        data: updatedFirm,
      });
    } catch (error) {
      console.error("Error updating firm:", error);
      res.status(500).json({ error: true, message: "Server Error" });
    }
  },

  delete: async (req, res) => {
    try {
      const deletedFirm = await Firm.findByIdAndDelete(req.params.id);

      if (!deletedFirm) {
        return res.status(404).json({ error: true, message: "Firm not found" });
      }

      res
        .status(200)
        .json({ error: false, message: "Firm deleted successfully." });
    } catch (error) {
      console.error("Error deleting firm:", error);
      res.status(500).json({ error: true, message: "Server Error" });
    }
  },
};
