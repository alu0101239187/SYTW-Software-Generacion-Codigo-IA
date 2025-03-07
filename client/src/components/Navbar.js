import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Expedientes
        </Typography>
        <Button color="inherit" onClick={() => navigate("/crear-expediente")}>
          Crear Expediente
        </Button>
        <Button color="inherit" onClick={() => navigate("/generar-informe")}>
          Generar Informe
        </Button>
        <Button color="inherit" onClick={logout}>
          Cerrar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
