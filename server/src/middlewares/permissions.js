"use strict";

module.exports = {
  isLogin: (req, res, next) => {
    if (req.user) {
      next();
    } else {
      return res.status(401).json({
        error: true,
        message: "Unauthorized access. Please log in.",
      });
    }
  },

  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ error: true, message: "Access denied. Admins only." });
    }
  },

  isStaff: (req, res, next) => {
    if (req.user && req.user.role === "staff") {
      next();
    } else {
      return res
        .status(403)
        .json({ error: true, message: "Access denied. Staff only." });
    }
  },

  isStaffOrAdmin: (req, res, next) => {
    if (req.user && (req.user.role === "staff" || req.user.role === "admin")) {
      next();
    } else {
      return res.status(403).json({
        error: true,
        message: "Access denied. Staff or Admins only.",
      });
    }
  },

  isUser: (req, res, next) => {
    if (req.user && req.user.role === "user") {
      next();
    } else {
      return res
        .status(403)
        .json({ error: true, message: "Access denied. Users only." });
    }
  },
};
