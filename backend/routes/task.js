// routes/task.js
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Crea una nuova attività
router.post("/create", async (req, res) => {
  try {
    const { nome, user, date } = req.body;
    const task = await Task.create({ nome, user, date });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Creazione attività fallita" });
  }
});

// Recupera tutte le attività
router.get("/all", async (req, res) => {
  try {
    const task = await Task.findAll();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Recupero attività fallito" });
  }
});

// Recupera tutte le attività di un singolo utente e di un singolo giorno
router.post("/findByUserIdAndDate", async (req, res) => {
  try {
    const { user, date } = req.body;
    const task = await Task.findAll({ where: { user, date } });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Recupero attività fallito" });
  }
});

// Elimina una attività
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.destroy({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Eliminazione attività fallita" });
  }
});

// Modifica una attività
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    const task = await Task.findOne({ where: { id } });
    task.nome = nome;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Modifica attività fallita" });
  }
});

module.exports = router;
