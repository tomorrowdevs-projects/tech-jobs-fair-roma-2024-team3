// routes/task.js
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { Sequelize } = require("sequelize");
const { verifyToken } = require("../middleware/authMiddleware");

// Crea una nuova attività
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { name, userId, date } = req.body;
    const task = await Task.create({ name, userId, date });
    switch (t.repeat) {
      case "Daily":
        for (let i = 1; i <= 60; i++) {
          const newDate = new Date(t.date);
          newDate.setDate(newDate.getDate() + i);
          await Task.create({ name: t.name, userId: t.userId, date: newDate, repeat: "None" });
        }
        break;
      case "Weekly":
        for (let i = 1; i <= 8; i++) {
          const newDate = new Date(t.date);
          newDate.setDate(newDate.getDate() + i * 7);
          await Task.create({ name: t.name, userId: t.userId, date: newDate, repeat: "None" });
        }
        break;
      case "Monthly":
        for (let i = 1; i <= 3; i++) {
          const newDate = new Date(t.date);
          newDate.setMonth(newDate.getMonth() + i);
          await Task.create({ name: t.name, userId: t.userId, date: newDate, repeat: "None" });
        }
        break;
      case "None":
        break;
      default:
        break;
    }
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create new task." });
  }
});

// Recupera tutte le attività
router.get("/all", verifyToken, async (req, res) => {
  try {
    const task = await Task.findAll({ where: { userId: req.userId } });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to get all tasks." });
  }
});

// Recupera tutte le attività di un singolo utente e di un singolo giorno
router.post("/findByUserIdAndDate", verifyToken, async (req, res) => {
  try {
    const { userId, date } = req.body;
    const tokenUserId = req.userId;
    if (tokenUserId !== userId) {
      return res.status(403).json({ error: "Unauthorized access." });
    }
    const dataStart = new Date(date).setHours(0, 0, 0, 0);
    const dataEnd = new Date(date).setHours(23, 59, 59, 59);
    const tasks = await Task.findAll({
      where: {
        userId,
        date: {
          [Sequelize.Op.gt]: dataStart,
          [Sequelize.Op.lt]: dataEnd,
        },
      },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to get task by user and date." });
  }
});

// Elimina una attività
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id } });
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    const tokenUserId = req.userId;
    if (tokenUserId !== task.userId) {
      return res.status(403).json({ error: "Unauthorized access." });
    }
    await Task.destroy({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task." });
  }
});

// Modifica una attività
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, done, date } = req.body;
    const task = await Task.findOne({ where: { id } });
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    const tokenUserId = req.userId;
    if (tokenUserId !== task.userId) {
      return res.status(403).json({ error: "Unauthorized access." });
    }
    task.name = name;
    task.done = done;
    task.date = date;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task." });
  }
});

module.exports = router;
