import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate Token helper
const generateToken = (id, username) => {
  return jwt.sign(
    { id, username },
    process.env.JWT_SECRET || "portfolio_jwt_secret_key_change_me_in_prod",
    { expiresIn: "30d" }
  );
};

// Seed default admin helper
const seedDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const defaultUser = process.env.ADMIN_USERNAME || "admin";
      const defaultPass = process.env.ADMIN_PASSWORD || "adminpassword";
      
      await User.create({
        username: defaultUser,
        password: defaultPass,
        role: "admin",
      });
      console.log(`Default admin user seeded: ${defaultUser}`);
    }
  } catch (error) {
    console.error("Warning: Seeding default admin failed:", error.message);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const fallbackUser = process.env.ADMIN_USERNAME || "admin";
  const fallbackPass = process.env.ADMIN_PASSWORD || "adminpassword";

  try {
    // Attempt database check
    let user = null;
    try {
      user = await User.findOne({ username });
    } catch (dbErr) {
      console.log("Database offline during login check, running in fallback mode.");
    }

    if (user) {
      // User found in DB
      if (await user.matchPassword(password)) {
        return res.json({
          _id: user._id,
          username: user.username,
          token: generateToken(user._id, user.username),
        });
      } else {
        return res.status(401).json({ message: "Invalid username or password" });
      }
    } else {
      // Fallback auth
      if (username === fallbackUser && password === fallbackPass) {
        return res.json({
          _id: "fallback-admin-id",
          username: fallbackUser,
          token: generateToken("fallback-admin-id", fallbackUser),
        });
      }
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Login route error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @desc    Verify current JWT token
// @route   GET /api/auth/verify
// @access  Private
router.get("/verify", protect, (req, res) => {
  res.json({
    valid: true,
    user: req.user,
  });
});

export { router as authRoutes, seedDefaultAdmin };
