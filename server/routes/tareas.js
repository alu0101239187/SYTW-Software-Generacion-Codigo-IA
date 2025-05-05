// server/routes/tareas.js
const express = require('express');
const Tarea = require('../models/Tarea');
const router = express.Router();

const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
    const tareas = await Tarea.find();
    res.json(tareas);
});

// Crear una nueva tarea
router.post('/', async (req, res) => {
    const { titulo, descripcion, completada } = req.body;

    try {
        const nuevaTarea = new Tarea({ titulo, descripcion, completada });
        await nuevaTarea.save();
        res.json(nuevaTarea);
    } catch (err) {
        res.status(500).send('Error al crear la tarea');
    }
});

module.exports = router;
