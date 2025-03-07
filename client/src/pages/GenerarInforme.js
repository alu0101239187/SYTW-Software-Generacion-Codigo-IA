import { useState } from "react";
import { Container, Typography, TextField, Button, Paper } from "@mui/material";
import axios from "axios";

const GenerarInforme = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const handleGenerarPDF = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const response = await axios.post(
      `http://localhost:5000/generar-pdf`,
      { fechaInicio, fechaFin },
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "informe.pdf");
    document.body.appendChild(link);
    link.click();
  };

  const handleGenerarCSV = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const response = await axios.post(
      `http://localhost:5000/generar-csv`,
      { fechaInicio, fechaFin },
      { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "informe.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Generar Informe
        </Typography>
        <TextField
          fullWidth
          type="date"
          label="Fecha de Inicio"
          InputLabelProps={{ shrink: true }}
          margin="normal"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
        <TextField
          fullWidth
          type="date"
          label="Fecha de Fin"
          InputLabelProps={{ shrink: true }}
          margin="normal"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleGenerarPDF}
        >
          Generar PDF
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          sx={{ mt: 1 }}
          onClick={handleGenerarCSV}
        >
          Generar CSV
        </Button>
      </Paper>
    </Container>
  );
};

export default GenerarInforme;
