import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedExp, setSelectedExp] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get("http://localhost:5000/expedientes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setExpedientes(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (selectedExp) {
      await axios.delete(`http://localhost:5000/expedientes/${selectedExp}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpedientes(expedientes.filter((exp) => exp._id !== selectedExp));
      setOpen(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
          Lista de Expedientes
        </Typography>
        <TextField
          fullWidth
          label="Buscar Expediente"
          variant="outlined"
          margin="normal"
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número de Expediente</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellidos</TableCell>
                <TableCell>Tipo de Petición</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expedientes
                .filter((exp) => exp.numero.includes(search))
                .map((exp) => (
                  <TableRow key={exp._id}>
                    <TableCell>{exp.numero}</TableCell>
                    <TableCell>{exp.nombre}</TableCell>
                    <TableCell>{exp.apellidos}</TableCell>
                    <TableCell>{exp.tipoPeticion}</TableCell>
                    <TableCell>{exp.estado}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          navigate(`/modificar-expediente/${exp._id}`)
                        }
                      >
                        Modificar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          setSelectedExp(exp._id);
                          setOpen(true);
                        }}
                        sx={{ ml: 1 }}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Modal de Confirmación */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este expediente?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dashboard;
