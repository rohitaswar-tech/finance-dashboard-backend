// ─────────────────────────────────────────────────────────────
//  routes/authRoutes.js  –  Public auth endpoints
// ─────────────────────────────────────────────────────────────
const express  = require("express");
const { body } = require("express-validator");

const { register, login, getMe } = require("../controllers/authController");
const { protect }                = require("../middleware/auth");
const validate                   = require("../middleware/validate");

const router = express.Router();

// POST /api/auth/register
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required").trim(),
    body("email").isEmail().withMessage("Provide a valid email").normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["viewer", "analyst", "admin"])
      .withMessage("Role must be viewer, analyst, or admin"),
  ],
  validate,
  register
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Provide a valid email").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

// GET /api/auth/me  (requires JWT)
router.get("/me", protect, getMe);

module.exports = router;
