const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

function signToken(userId) {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
}

// POST /api/auth/register (employee register)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashed,
      role: "employee",
      isApproved: false
    });

    return res.status(201).json({
      message: "Registration successful. Waiting for admin approval.",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved }
    });
  } catch (_err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login (admin/employee login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    if (user.role === "employee" && !user.isApproved) {
      return res.status(403).json({ message: "Waiting for admin approval", code: "NOT_APPROVED" });
    }

    const token = signToken(user._id.toString());
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (_err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

