import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Asegúrate de que esté instalado con: npm install jwt-decode

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Función para iniciar sesión
  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  // ✅ Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  // ✅ Verificar el token al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);

        // Verificar si el token ha expirado
        if (decodedUser.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decodedUser);
        }
      } catch (error) {
        console.error("Token inválido:", error);
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
