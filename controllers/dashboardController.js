// ─────────────────────────────────────────────────────────────
//  controllers/dashboardController.js  –  Aggregation / stats
// ─────────────────────────────────────────────────────────────
const FinancialRecord = require("../models/FinancialRecord");
const mongoose        = require("mongoose");

// ── Helper: build match stage based on role + optional date range
const buildMatch = (user, query) => {
  // Admins see all; everyone else sees their own
  const match = user.role === "admin" ? {} : { user: new mongoose.Types.ObjectId(user._id) };

  if (query.from || query.to) {
    match.date = {};
    if (query.from) match.date.$gte = new Date(query.from);
    if (query.to)   match.date.$lte = new Date(query.to);
  }

  return match;
};

// ── GET /api/dashboard/summary ────────────────────────────────
// Returns: totalIncome, totalExpenses, balance, recordCount
const getSummary = async (req, res, next) => {
  try {
    const match = buildMatch(req.user, req.query);

    const result = await FinancialRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id:           null,
          totalIncome:   { $sum: { $cond: [{ $eq: ["$type", "income"] },   "$amount", 0] } },
          totalExpenses: { $sum: { $cond: [{ $eq: ["$type", "expense"] },  "$amount", 0] } },
          recordCount:   { $sum: 1 },
        },
      },
      {
        $project: {
          _id:           0,
          totalIncome:   1,
          totalExpenses: 1,
          balance:       { $subtract: ["$totalIncome", "$totalExpenses"] },
          recordCount:   1,
        },
      },
    ]);

    // If no records exist, return zeros
    const summary = result[0] || {
      totalIncome:   0,
      totalExpenses: 0,
      balance:       0,
      recordCount:   0,
    };

    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/dashboard/by-category ───────────────────────────
// Returns totals grouped by category (useful for pie charts)
const getByCategory = async (req, res, next) => {
  try {
    const match = buildMatch(req.user, req.query);

    // Optionally filter by type: ?type=expense
    if (req.query.type) match.type = req.query.type;

    const result = await FinancialRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id:   "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          type:  { $first: "$type" },
        },
      },
      { $sort: { total: -1 } }, // Highest first
      {
        $project: {
          _id:      0,
          category: "$_id",
          total:    1,
          count:    1,
          type:     1,
        },
      },
    ]);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/dashboard/trends ─────────────────────────────────
// Monthly income vs expense totals (useful for line/bar charts)
// ?year=2024  (defaults to current year)
const getTrends = async (req, res, next) => {
  try {
    const match = buildMatch(req.user, req.query);

    // Filter to requested year (default: current year)
    const year = parseInt(req.query.year, 10) || new Date().getFullYear();
    match.date = {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    };

    const result = await FinancialRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            type:  "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // Reshape into { month: 1-12, income: X, expense: Y } array
    const months = Array.from({ length: 12 }, (_, i) => ({
      month:   i + 1,
      income:  0,
      expense: 0,
    }));

    result.forEach(({ _id, total }) => {
      const idx = _id.month - 1;
      if (_id.type === "income")  months[idx].income  = total;
      if (_id.type === "expense") months[idx].expense = total;
    });

    // Add balance per month
    months.forEach((m) => {
      m.balance = m.income - m.expense;
    });

    res.json({ success: true, year, data: months });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/dashboard/recent ─────────────────────────────────
// Last 5 transactions (quick glance widget)
const getRecentTransactions = async (req, res, next) => {
  try {
    const filter =
      req.user.role === "admin"
        ? {}
        : { user: req.user._id };

    const records = await FinancialRecord.find(filter)
      .sort({ date: -1 })
      .limit(5)
      .populate("user", "name");

    res.json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary, getByCategory, getTrends, getRecentTransactions };
