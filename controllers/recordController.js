// ─────────────────────────────────────────────────────────────
//  controllers/recordController.js  –  Financial record CRUD
// ─────────────────────────────────────────────────────────────
const FinancialRecord = require("../models/FinancialRecord");

// ── Helper: scope records by role ────────────────────────────
// Admins & analysts see all records; viewers only see their own.
const buildUserFilter = (user) => {
  if (user.role === "admin") return {};              // All records
  return { user: user._id };                         // Own records only
};

// ── GET /api/records ──────────────────────────────────────────
// Supports filtering: ?type=income&category=salary&from=2024-01-01&to=2024-12-31
const getRecords = async (req, res, next) => {
  try {
    const filter = buildUserFilter(req.user);

    // Optional query filters
    if (req.query.type)     filter.type     = req.query.type;
    if (req.query.category) filter.category = new RegExp(req.query.category, "i");

    // Date range filter
    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) filter.date.$gte = new Date(req.query.from);
      if (req.query.to)   filter.date.$lte = new Date(req.query.to);
    }

    // Pagination
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip  = (page - 1) * limit;

    const [records, total] = await Promise.all([
      FinancialRecord.find(filter)
        .populate("user", "name email")   // Attach user name + email
        .sort({ date: -1 })               // Newest first
        .skip(skip)
        .limit(limit),
      FinancialRecord.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data:  records,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/records/:id ──────────────────────────────────────
const getRecordById = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...buildUserFilter(req.user) };
    const record = await FinancialRecord.findOne(filter).populate("user", "name email");

    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found." });
    }

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/records ─────────────────────────────────────────
// analyst and admin can create records
const createRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const record = await FinancialRecord.create({
      user:     req.user._id, // Owner = logged-in user
      amount,
      type,
      category,
      date,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Record created.",
      data:    record,
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/records/:id ──────────────────────────────────────
// Analysts can only edit their own; admins can edit any
const updateRecord = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...buildUserFilter(req.user) };
    const { amount, type, category, date, notes } = req.body;

    const record = await FinancialRecord.findOneAndUpdate(
      filter,
      { amount, type, category, date, notes },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found." });
    }

    res.json({ success: true, message: "Record updated.", data: record });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/records/:id ───────────────────────────────────
// Analysts can only delete their own; admins can delete any
const deleteRecord = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...buildUserFilter(req.user) };
    const record = await FinancialRecord.findOneAndDelete(filter);

    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found." });
    }

    res.json({ success: true, message: "Record deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecords, getRecordById, createRecord, updateRecord, deleteRecord };
