// ─────────────────────────────────────────────────────────────
//  models/FinancialRecord.js  –  Income / expense record schema
// ─────────────────────────────────────────────────────────────
const mongoose = require("mongoose");

const financialRecordSchema = new mongoose.Schema(
  {
    // The user who created this record
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },

    // ── Core Fields ────────────────────────────────────────
    amount: {
      type:     Number,
      required: [true, "Amount is required"],
      min:      [0.01, "Amount must be greater than 0"],
    },

    // "income" or "expense"
    type: {
      type:     String,
      required: [true, "Type is required"],
      enum:     ["income", "expense"],
    },

    // Flexible category (salary, rent, groceries, freelance, etc.)
    category: {
      type:     String,
      required: [true, "Category is required"],
      trim:     true,
      maxlength: [50, "Category cannot exceed 50 characters"],
    },

    // Date of the transaction (defaults to today)
    date: {
      type:    Date,
      default: Date.now,
    },

    // Optional description / note
    notes: {
      type:     String,
      trim:     true,
      maxlength: [200, "Notes cannot exceed 200 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// ── Index for faster dashboard queries ────────────────────────
financialRecordSchema.index({ user: 1, date: -1 });
financialRecordSchema.index({ user: 1, type: 1 });
financialRecordSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model("FinancialRecord", financialRecordSchema);
