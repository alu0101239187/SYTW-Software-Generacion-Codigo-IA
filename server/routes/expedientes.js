// server/routes/expedientes.js
const express = require('express');
const Expediente = require('../models/Expediente');
const auth = require('../middleware/auth');
const router = express.Router();

// Obtener todos los expedientes
router.get('/', auth, async (req, res) => {
    const expedientes = await Expediente.find();
    res.json(expedientes);
});

// Eliminar un expediente
router.delete('/:id', auth, async (req, res) => {
    try {
        await Expediente.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Expediente eliminado' });
    } catch {
        res.status(500).json({ mensaje: 'Error al eliminar expediente' });
    }
});

router.post('/', auth, async (req, res) => {
    const { numero, dni, nombre, apellidos, tipo, estado, fecha, unidad } = req.body;

    try {
        const yaExiste = await Expediente.findOne({ numero });
        if (yaExiste) return res.status(400).json({ mensaje: 'Número de expediente ya existe' });

        const nuevoExpediente = new Expediente({
            numero, dni, nombre, apellidos, tipo, estado, fecha, unidad
        });
        await nuevoExpediente.save();

        res.status(201).json({ mensaje: 'Expediente creado correctamente' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al guardar expediente' });
    }
});

// GET /api/expedientes/rango?inicio=YYYY-MM-DD&fin=YYYY-MM-DD
router.get('/rango', auth, async (req, res) => {
    const { inicio, fin } = req.query;
    try {
        const expedientes = await Expediente.find({
            fecha: {
                $gte: new Date(inicio),
                $lte: new Date(fin)
            }
        });
        res.json(expedientes);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener los expedientes' });
    }
});

// GET /api/expedientes/:id
router.get('/:id', auth, async (req, res) => {
    try {
        const expediente = await Expediente.findById(req.params.id);
        if (!expediente) return res.status(404).json({ mensaje: 'Expediente no encontrado' });
        res.json(expediente);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al buscar el expediente' });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { dni, nombre, apellidos, tipo, estado, fecha, unidad } = req.body;

        const expediente = await Expediente.findById(req.params.id);
        if (!expediente) {
            return res.status(404).json({ mensaje: 'Expediente no encontrado' });
        }

        // Actualizar campos permitidos
        expediente.dni = dni;
        expediente.nombre = nombre;
        expediente.apellidos = apellidos;
        expediente.tipo = tipo;
        expediente.estado = estado;
        expediente.fecha = fecha;
        expediente.unidad = unidad;

        await expediente.save();
        res.json({ mensaje: 'Expediente actualizado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: 'Error al actualizar el expediente' });
    }
});

module.exports = router;
