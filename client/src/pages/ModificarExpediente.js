import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ModificarExpediente = () => {
  const { id } = useParams();
  const [expediente, setExpediente] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`http://localhost:5000/expedientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setExpediente(response.data))
      .catch(() => setError("Error al cargar expediente"));
  }, [id]);

  const handleChange = (e) => {
    setExpediente({ ...expediente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(`http://localhost:5000/expedientes/${id}`, expediente, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch {
      setError("Error al modificar el expediente");
    }
  };

  if (!expediente) return <Typography>Cargando...</Typography>;

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Modificar Expediente
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
            value={expediente.numero}
            disabled
          />
          <TextField
            fullWidth
            label="DNI"
            name="dni"
            margin="normal"
            value={expediente.dni}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            margin="normal"
            value={expediente.nombre}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Apellidos"
            name="apellidos"
            margin="normal"
            value={expediente.apellidos}
            onChange={handleChange}
          />
          <TextField
            select
            fullWidth
            label="Tipo de Petición"
            name="tipoPeticion"
            margin="normal"
            value={expediente.tipoPeticion}
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
            value={expediente.estado}
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
            name="fecha"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={expediente.fechaExpediente}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Unidad Administrativa"
            name="unidadAdministrativa"
            margin="normal"
            value={expediente.unidadAdministrativa}
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
            Guardar Cambios
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ModificarExpediente;
