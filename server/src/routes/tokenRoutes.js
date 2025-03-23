// routes/token.js

"use strict";

const router = require("express").Router();
const { isAdmin } = require("../middlewares/permissions");
const tokenController = require("../controllers/token");

// Apply isAdmin middleware to all routes in this router
router.use(isAdmin);

router.route("/").get(tokenController.list).post(tokenController.create);

router
  .route("/:id")
  .get(tokenController.read)
  .put(tokenController.update)
  .patch(tokenController.update)
  .delete(tokenController.delete);

module.exports = router;
