// routes/task.js
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { Sequelize } = require("sequelize");

// Crea una nuova attività
router.post("/create", async (req, res) => {
  try {
    const { name, userId, date } = req.body;
    const task = await Task.create({ name, userId, date });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create new task." });
  }
});

// Recupera tutte le attività
router.get("/all", async (req, res) => {
  try {
    const task = await Task.findAll();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to get all tasks." });
  }
});

// Recupera tutte le attività di un singolo utente e di un singolo giorno
router.post("/findByUserIdAndDate", async (req, res) => {
  try {
    const { userId, date } = req.body;
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
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.destroy({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task." });
  }
});

// Modifica una attività
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, done, date } = req.body;
    const task = await Task.findOne({ where: { id } });
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
