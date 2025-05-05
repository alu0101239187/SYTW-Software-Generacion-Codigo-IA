// server/models/Tarea.js
const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String },
    completada: { type: Boolean, default: false }
});

module.exports = mongoose.model('Tarea', tareaSchema);
