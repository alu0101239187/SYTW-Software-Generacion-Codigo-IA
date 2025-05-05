const mongoose = require('mongoose');

const expedienteSchema = new mongoose.Schema({
    numero: { type: String, required: true, unique: true },
    dni: { type: String, required: true },
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    tipo: { type: String, enum: ['Contratos', 'Estadística', 'Institucional'], required: true },
    estado: { type: String, enum: ['Creada', 'Pendiente', 'Estimada', 'Desestimada'], required: true },
    fecha: { type: Date, required: true },
    unidad: { type: String, required: true }
});

module.exports = mongoose.model('Expediente', expedienteSchema);