import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { purple } from "@mui/material/colors";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CrearExpediente from "./pages/CrearExpediente";
import ModificarExpediente from "./pages/ModificarExpediente";
import GenerarInforme from "./pages/GenerarInforme";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const theme = createTheme({
  palette: {
    primary: { main: purple[700] },
    secondary: { main: purple[300] },
    background: { default: purple[50] },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crear-expediente"
            element={
              <ProtectedRoute>
                <CrearExpediente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modificar-expediente/:id"
            element={
              <ProtectedRoute>
                <ModificarExpediente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generar-informe"
            element={
              <ProtectedRoute>
                <GenerarInforme />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
