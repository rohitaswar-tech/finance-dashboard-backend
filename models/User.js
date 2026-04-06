// ─────────────────────────────────────────────────────────────
//  models/User.js  –  User schema with roles
// ─────────────────────────────────────────────────────────────
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Name is required"],
      trim:     true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type:     String,
      required: [true, "Email is required"],
      unique:   true,             // No duplicate emails
      lowercase: true,
      trim:     true,
    },

    password: {
      type:     String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select:   false,            // Never returned in queries by default
    },

    // ── Roles ──────────────────────────────────────────────
    // viewer  → read-only access
    // analyst → read + create/edit own records
    // admin   → full access including user management
    role: {
      type:    String,
      enum:    ["viewer", "analyst", "admin"],
      default: "viewer",
    },

    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ── Hash password before saving ──────────────────────────────
userSchema.pre("save", async function (next) {
  // Only hash if the password field was changed (not on other updates)
  if (!this.isModified("password")) return next();

  const salt   = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare passwords ───────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
