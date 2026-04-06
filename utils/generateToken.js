// ─────────────────────────────────────────────────────────────
//  utils/generateToken.js  –  Sign and return a JWT
// ─────────────────────────────────────────────────────────────
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                      // Payload: only store user ID
    process.env.JWT_SECRET,              // Secret key from .env
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // Expiry
  );
};

module.exports = generateToken;
