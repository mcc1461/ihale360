// routes/user.js

"use strict";

const router = require("express").Router();
const { isAdmin, isLogin } = require("../middlewares/permissions");
const userController = require("../controllers/user");

// Registration Route (unprotected)
router.post("/", userController.create);

// Apply isLogin middleware to all routes below
router.use(isLogin);

router.get("/", userController.list);

router
  .route("/:id")
  .get(userController.read)
  .put(userController.update)
  .patch(userController.update)
  .delete(isAdmin, userController.remove); // Only admin can delete users

module.exports = router;
