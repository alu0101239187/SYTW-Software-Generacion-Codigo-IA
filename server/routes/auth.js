// server/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

// Registro de usuario (opcional, para pruebas)
router.post('/register', async (req, res) => {
    const { nombreUsuario, contraseña } = req.body;

    try {
        const existe = await Usuario.findOne({ nombreUsuario });
        if (existe) return res.status(400).json({ mensaje: 'Usuario ya existe' });

        const hash = await bcrypt.hash(contraseña, 10);
        const nuevoUsuario = new Usuario({ nombreUsuario, contraseña: hash });
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario creado' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { nombreUsuario, contraseña } = req.body;

    try {
        const usuario = await Usuario.findOne({ nombreUsuario });
        if (!usuario) return res.status(400).json({ mensaje: 'Usuario incorrecto' });

        const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esValida) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al autenticar' });
    }
});

module.exports = router;
