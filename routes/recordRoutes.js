// ─────────────────────────────────────────────────────────────
//  routes/recordRoutes.js  –  Financial record CRUD
// ─────────────────────────────────────────────────────────────
const express  = require("express");
const { body } = require("express-validator");

const {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");

const { protect, authorizeRoles } = require("../middleware/auth");
const validate                    = require("../middleware/validate");

const router = express.Router();

// Shared validation rules for create & update
const recordValidation = [
  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),
  body("type")
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .trim(),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO date (e.g. 2024-06-15)"),
  body("notes")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Notes cannot exceed 200 characters")
    .trim(),
];

// All routes require authentication
router.use(protect);

// GET  /api/records        – all users (scoped by role)
// POST /api/records        – analyst + admin only
router
  .route("/")
  .get(getRecords)
  .post(authorizeRoles("analyst", "admin"), recordValidation, validate, createRecord);

// GET    /api/records/:id  – all users (scoped by role)
// PUT    /api/records/:id  – analyst (own) + admin (any)
// DELETE /api/records/:id  – analyst (own) + admin (any)
router
  .route("/:id")
  .get(getRecordById)
  .put(authorizeRoles("analyst", "admin"), recordValidation, validate, updateRecord)
  .delete(authorizeRoles("analyst", "admin"), deleteRecord);

module.exports = router;
