// Importaciones necesarias
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pdfkit = require("pdfkit");
const fs = require("fs");
const csvWriter = require("csv-writer").createObjectCsvWriter;
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

const ExpedienteSchema = new mongoose.Schema({
  numero: { type: String, unique: true },
  dni: String,
  nombre: String,
  apellidos: String,
  tipo: String,
  estado: String,
  fecha: Date,
  unidad: String,
});
const Expediente = mongoose.model("Expediente", ExpedienteSchema);

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "Token no proporcionado" });

  const token = authHeader.split(" ")[1]; // Eliminar "Bearer"
  if (!token) return res.status(401).json({ message: "Token no válido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Token inválido o expirado" });
    req.user = user;
    next();
  });
};

// Rutas de autenticación
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// CRUD de expedientes
app.post("/expedientes", verifyToken, async (req, res) => {
  try {
    const nuevoExpediente = new Expediente(req.body);
    await nuevoExpediente.save();
    res.status(201).json(nuevoExpediente);
  } catch (error) {
    res.status(400).json({ error: "Error al crear expediente" });
  }
});

app.get("/expedientes", verifyToken, async (req, res) => {
  const expedientes = await Expediente.find();
  res.json(expedientes);
});

app.get("/expedientes/:id", verifyToken, async (req, res) => {
  const expedientes = await Expediente.findById(req.params.id);
  res.json(expedientes);
});

app.put("/expedientes/:id", verifyToken, async (req, res) => {
  try {
    const expediente = await Expediente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(expediente);
  } catch (error) {
    res.status(400).json({ error: "Error al modificar expediente" });
  }
});

app.delete("/expedientes/:id", verifyToken, async (req, res) => {
  try {
    await Expediente.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar expediente" });
  }
});

// Generar informe en PDF
app.post("/generar-pdf", verifyToken, async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.body;
    const expedientes = await Expediente.find({
      fecha: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) },
    });

    const doc = new pdfkit();
    const filePath = `./informes/informe_${Date.now()}.pdf`;

    // Crear el PDF
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc.text("Informe de Expedientes", { align: "center" });

    expedientes.forEach((exp) => {
      doc.text(
        `${exp.numero} - ${exp.nombre} ${exp.apellidos} - ${exp.tipo} - ${exp.estado}`
      );
    });

    doc.end();

    // Esperar a que el archivo termine de guardarse
    writeStream.on("finish", () => {
      res.sendFile(filePath, { root: "." }, (err) => {
        if (err) {
          console.error("Error al enviar el archivo:", err);
          res.status(500).json({ error: "Error al enviar el archivo" });
        }
      });
    });
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).json({ error: "Error al generar el PDF" });
  }
});

// Generar informe en CSV
app.post("/generar-csv", verifyToken, async (req, res) => {
  const { fechaInicio, fechaFin } = req.body;
  const expedientes = await Expediente.find({
    fecha: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) },
  });

  const filePath = `./informes/informe_${Date.now()}.csv`;
  const writer = csvWriter({
    path: filePath,
    header: [
      { id: "numero", title: "Número" },
      { id: "dni", title: "DNI" },
      { id: "nombre", title: "Nombre" },
      { id: "apellidos", title: "Apellidos" },
      { id: "tipo", title: "Tipo" },
      { id: "estado", title: "Estado" },
      { id: "fecha", title: "Fecha" },
      { id: "unidad", title: "Unidad" },
    ],
  });

  await writer.writeRecords(expedientes);
  res.download(filePath);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
