// ─────────────────────────────────────────────────────────────
//  routes/dashboardRoutes.js  –  Analytics endpoints
// ─────────────────────────────────────────────────────────────
const express = require("express");

const {
  getSummary,
  getByCategory,
  getTrends,
  getRecentTransactions,
} = require("../controllers/dashboardController");

const { protect, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

// GET /api/dashboard/summary      – total income, expenses, balance
// GET /api/dashboard/by-category  – grouped by category (pie chart data)
// GET /api/dashboard/trends       – monthly trends (line/bar chart data)
// GET /api/dashboard/recent       – last 5 transactions

// All roles can view the dashboard (viewer, analyst, admin)
router.get("/summary",      getSummary);
router.get("/by-category",  getByCategory);
router.get("/trends",       getTrends);
router.get("/recent",       getRecentTransactions);

module.exports = router;
