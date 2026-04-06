// ─────────────────────────────────────────────────────────────
//  server.js  –  Entry point for the Finance Dashboard API
// ─────────────────────────────────────────────────────────────
require("dotenv").config();          // Load .env variables first
const app        = require("./app"); // Express app
const connectDB  = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀  Server running on http://localhost:${PORT}`);
    console.log(`📊  Finance Dashboard API ready\n`);
  });
});
