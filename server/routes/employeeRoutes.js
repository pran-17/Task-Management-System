const express = require("express");

const { protect, requireRole } = require("../middleware/authMiddleware");
const Task = require("../models/Task");

const router = express.Router();

router.use(protect, requireRole("employee"));

// GET /api/employee/tasks/:employeeId
router.get("/tasks/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (req.user._id.toString() !== employeeId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const tasks = await Task.find({ assignedTo: employeeId }).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (_err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/employee/task/:taskId
router.put("/task/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body || {};
    const allowed = ["Pending", "In Progress", "Completed"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const task = await Task.findOne({ _id: taskId, assignedTo: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = status;
    await task.save();
    return res.json(task);
  } catch (_err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

