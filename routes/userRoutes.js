// ─────────────────────────────────────────────────────────────
//  routes/userRoutes.js  –  Admin-only user management
// ─────────────────────────────────────────────────────────────
const express  = require("express");
const { body } = require("express-validator");

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const { protect, authorizeRoles } = require("../middleware/auth");
const validate                    = require("../middleware/validate");

const router = express.Router();

// All routes below require: valid JWT + admin role
router.use(protect, authorizeRoles("admin"));

// GET  /api/users          – list all users
// GET  /api/users/:id      – get one user
// PUT  /api/users/:id      – update role / status
// DELETE /api/users/:id   – deactivate user

router.get("/",    getAllUsers);
router.get("/:id", getUserById);

router.put(
  "/:id",
  [
    body("role")
      .optional()
      .isIn(["viewer", "analyst", "admin"])
      .withMessage("Invalid role"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be true or false"),
  ],
  validate,
  updateUser
);

router.delete("/:id", deleteUser);

module.exports = router;
