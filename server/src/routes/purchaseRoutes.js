"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
const express = require("express");
const router = express.Router();
/* ------------------------------------------------------- */
// routes/purchase:

const authentication = require("../middlewares/authentication");
const permissions = require("../middlewares/permissions");
const purchaseController = require("../controllers/purchase");

// URL: /purchases

router.use(authentication); // Apply authentication middleware to all routes

router
  .route("/")
  .get(permissions.isStaffOrAdmin, purchaseController.list)
  .post(permissions.isStaffOrAdmin, purchaseController.create);

router
  .route("/:id")
  .get(permissions.isStaffOrAdmin, purchaseController.read)
  .put(permissions.isStaffOrAdmin, purchaseController.update)
  .patch(permissions.isStaffOrAdmin, purchaseController.update)
  .delete(permissions.isStaffOrAdmin, purchaseController.delete);

/* ------------------------------------------------------- */
module.exports = router;
