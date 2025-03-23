"use strict";
const router = require("express").Router();

// router.get("/users", (req, res) => {
//   res.send("Hello from users");
// });

// Sub-routes
router.use("/auth", require("./authRoutes")); // This should ensure /auth works
router.use("/users", require("./userRoutes")); // This should ensure /api/users works
router.use("/tokens", require("./tokenRoutes"));
router.use("/categories", require("./categoryRoutes"));
router.use("/brands", require("./brandRoutes"));
router.use("/firms", require("./firmRoutes"));
router.use("/products", require("./productRoutes"));
router.use("/purchases", require("./purchaseRoutes"));
router.use("/sales", require("./saleRoutes"));
router.use("/documents", require("./documentRoutes"));

module.exports = router;
