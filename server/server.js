// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const tareaRoutes = require('./routes/tareas');
const authRoutes = require('./routes/auth');
const expedienteRoutes = require('./routes/expedientes');

// Middleware
app.use(express.json());

app.use(cors());
app.use('/api/tareas', tareaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/expedientes', expedienteRoutes);

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.log(err));

// Definir rutas
app.get('/', (req, res) => {
    res.send('API funcionando');
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
