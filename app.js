// ─────────────────────────────────────────────────────────────
//  app.js  –  Express app setup (middleware + routes)
// ─────────────────────────────────────────────────────────────
const express      = require("express");
const errorHandler = require("./middleware/errorHandler");

const authRoutes      = require("./routes/authRoutes");
const userRoutes      = require("./routes/userRoutes");
const recordRoutes    = require("./routes/recordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ── Global Middleware ─────────────────────────────────────────
app.use(express.json());             // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse form data

// ── Health Check ──────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Finance Dashboard API is running ✅" });
});

// ── API Routes ────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);       // Login / Register
app.use("/api/users",     userRoutes);       // User management (admin)
app.use("/api/records",   recordRoutes);     // Financial CRUD
app.use("/api/dashboard", dashboardRoutes);  // Analytics / stats

// ── Global Error Handler (must be last) ──────────────────────
app.use(errorHandler);

module.exports = app;
