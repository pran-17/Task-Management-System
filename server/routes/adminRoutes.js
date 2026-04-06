const express = require("express");
const bcrypt = require("bcryptjs");

const { protect, requireRole } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Task = require("../models/Task");

const router = express.Router();

router.use(protect, requireRole("admin"));

// POST /api/admin/employee
// Admin can directly create approved employee accounts.
router.post("/employee", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const employee = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
      role: "employee",
      isApproved: true
    });

    return res.status(201).json({
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      isApproved: employee.isApproved
    });
  } catch (_err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/employees
router.get("/employees", async (_req, res) => {
  try {
    const employees = await User.find({ role: "employee" })
      .select("-password")
      .sort({ createdAt: -1 });
    return res.json(employees);
  } catch (_err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/admin/approve/:id
router.put("/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await User.findOneAndUpdate(
      { _id: id, role: "employee" },
      { $set: { isApproved: true } },
      { new: true }
    ).select("-password");

    if (!employee) return res.status(404).json({ message: "Employee not found" });
    return res.json(employee);
  } catch (_err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/task
router.post("/task", async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body || {};
    if (!title || !assignedTo) return res.status(400).json({ message: "Title and assignedTo are required" });

    const employee = await User.findOne({ _id: assignedTo, role: "employee" });
    if (!employee) return res.status(400).json({ message: "Invalid employee" });
    if (!employee.isApproved) return res.status(400).json({ message: "Employee is not approved yet" });

    const task = await Task.create({
      title,
      description: description || "",
      assignedTo,
      status: "Pending"
    });

    return res.status(201).json(task);
  } catch (_err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/tasks
router.get("/tasks", async (_req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email role isApproved")
      .sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (_err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

