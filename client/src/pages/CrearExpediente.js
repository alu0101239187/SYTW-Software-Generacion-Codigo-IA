import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CrearExpediente = () => {
  const [expediente, setExpediente] = useState({
    numero: "",
    dni: "",
    nombre: "",
    apellidos: "",
    tipo: "",
    estado: "",
    fecha: "",
    unidadAdministrativa: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setExpediente({ ...expediente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    if (Object.values(expediente).some((value) => value === "")) {
      setError("Todos los campos son obligatorios");
      return;
    }
    try {
      await axios.post("http://localhost:5000/expedientes", expediente, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Error al crear el expediente");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Crear Expediente
        </Typography>
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Número de Expediente"
            name="numero"
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="DNI"
            name="dni"
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Apellidos"
            name="apellidos"
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            select
            fullWidth
            label="Tipo de Petición"
            name="tipo"
            margin="normal"
            onChange={handleChange}
          >
            <MenuItem value="Contratos">Contratos</MenuItem>
            <MenuItem value="Estadística">Estadística</MenuItem>
            <MenuItem value="Institucional">Institucional</MenuItem>
          </TextField>
          <TextField
            select
            fullWidth
            label="Estado"
            name="estado"
            margin="normal"
            onChange={handleChange}
          >
            <MenuItem value="Creada">Creada</MenuItem>
            <MenuItem value="Pendiente">Pendiente</MenuItem>
            <MenuItem value="Estimada">Estimada</MenuItem>
            <MenuItem value="Desestimada">Desestimada</MenuItem>
          </TextField>
          <TextField
            fullWidth
            type="date"
            label="Fecha de Expediente"
            name="fechaExpediente"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Unidad Administrativa"
            name="unidadAdministrativa"
            margin="normal"
            onChange={handleChange}
          />
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={() => navigate("/dashboard")}
          >
            Cancelar
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 1 }}
          >
            Añadir Expediente
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CrearExpediente;
