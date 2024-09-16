// routes/attivita.js
const express = require('express');
const router = express.Router();
const Attivita = require('../models/Attivita');

// Crea una nuova attività
router.post('/create', async (req, res) => {
    try {
        const { nome } = req.body;
        const attivita = await Attivita.create({ nome });
        res.status(201).json(attivita);
    } catch (error) {
        res.status(500).json({ error: 'Creazione attività fallita' });
    }
});

// Recupera tutte le attività
router.get('/all', async (req, res) => {
    try {
        const attivita = await Attivita.findAll();
        res.json(attivita);
    } catch (error) {
        res.status(500).json({ error: 'Recupero attività fallito' });
    }
}); 

// Elimina una attività
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Attivita.destroy({ where: { id } });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Eliminazione attività fallita' });
    }
});

// Modifica una attività
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;
        const attivita = await Attivita.findOne({ where: { id } });
        attivita.nome = nome;
        await attivita.save();
        res.json(attivita);
    } catch (error) {
        res.status(500).json({ error: 'Modifica attività fallita' });
    }   
});

module.exports = router;
