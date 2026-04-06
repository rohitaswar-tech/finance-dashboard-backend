// ─────────────────────────────────────────────────────────────
//  middleware/auth.js  –  JWT verification middleware
// ─────────────────────────────────────────────────────────────
const jwt  = require("jsonwebtoken");
const User = require("../models/User");

// ── protect ───────────────────────────────────────────────────
// Checks for a valid JWT in the Authorization header.
// Attaches the user object to req.user for downstream use.
const protect = async (req, res, next) => {
  let token;

  // JWT should be sent as: "Authorization: Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No token provided.",
    });
  }

  try {
    // Verify the token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the full user (minus password) to the request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists or is deactivated.",
      });
    }

    next(); // Token is valid – proceed to the route handler
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// ── authorizeRoles ────────────────────────────────────────────
// Factory function – returns middleware that checks if the
// authenticated user's role is in the allowed list.
//
// Usage in routes:
//   router.delete("/users/:id", protect, authorizeRoles("admin"), ...)
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not allowed to perform this action.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
