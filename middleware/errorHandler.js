// ─────────────────────────────────────────────────────────────
//  middleware/errorHandler.js  –  Centralized error responses
// ─────────────────────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || "Internal Server Error";

  // ── Mongoose: bad ObjectId (e.g. /records/not-an-id) ─────
  if (err.name === "CastError") {
    statusCode = 404;
    message    = `Resource not found with id: ${err.value}`;
  }

  // ── Mongoose: duplicate key (e.g. duplicate email) ────────
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message    = `${field} already exists. Please use a different value.`;
  }

  // ── Mongoose: validation errors ───────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 400;
    // Collect all validation messages into one array
    message = Object.values(err.errors).map((e) => e.message);
  }

  // ── JWT errors ────────────────────────────────────────────
  if (err.name === "JsonWebTokenError")  { statusCode = 401; message = "Invalid token."; }
  if (err.name === "TokenExpiredError")  { statusCode = 401; message = "Token has expired."; }

  // Log in development for easier debugging
  if (process.env.NODE_ENV === "development") {
    console.error("💥 Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
