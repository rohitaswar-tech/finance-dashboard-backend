// ─────────────────────────────────────────────────────────────
//  controllers/userController.js  –  Admin: manage all users
// ─────────────────────────────────────────────────────────────
const User = require("../models/User");

// ── GET /api/users  [admin only] ──────────────────────────────
// Returns all users (paginated)
const getAllUsers = async (req, res, next) => {
  try {
    // Simple pagination: ?page=1&limit=10
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip  = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data:  users,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/users/:id  [admin only] ─────────────────────────
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/users/:id  [admin only] ─────────────────────────
// Admin can update name, role, or isActive status
const updateUser = async (req, res, next) => {
  try {
    const { name, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, isActive },
      { new: true, runValidators: true } // Return updated doc + validate
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({ success: true, message: "User updated.", data: user });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/users/:id  [admin only] ──────────────────────
// Soft delete: just deactivates the account
const deleteUser = async (req, res, next) => {
  try {
    // Prevent admin from deleting their own account
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({ success: true, message: "User deactivated successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
