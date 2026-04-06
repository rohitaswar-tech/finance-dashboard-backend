// ─────────────────────────────────────────────────────────────
//  controllers/authController.js  –  Register & Login
// ─────────────────────────────────────────────────────────────
const User          = require("../models/User");
const generateToken = require("../utils/generateToken");

// ── POST /api/auth/register ───────────────────────────────────
// Creates a new user account (default role: viewer)
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    // Create user (password hashing happens in the model pre-save hook)
    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

// ── POST /api/auth/login ──────────────────────────────────────
// Validates credentials and returns a JWT
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly include the password field (select: false by default)
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account has been deactivated. Contact an admin.",
      });
    }

    res.json({
      success: true,
      message: "Login successful.",
      data: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────
// Returns the currently logged-in user's profile
const getMe = async (req, res) => {
  res.json({
    success: true,
    data:    req.user, // Attached by the protect middleware
  });
};

module.exports = { register, login, getMe };
