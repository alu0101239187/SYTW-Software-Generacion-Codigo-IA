// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Expedientes from './pages/Expedientes';
import Login from './pages/Login';
import PrivateRoute from './utils/PrivateRoute';
import CrearExpediente from './pages/CrearExpediente';
import GenerarInforme from './pages/GenerarInforme';
import ModificarExpediente from './pages/ModificarExpediente';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Expedientes />
            </PrivateRoute>
          }
        />
        <Route
          path="/crear"
          element={
            <PrivateRoute>
              <CrearExpediente />
            </PrivateRoute>
          }
        />
        <Route
          path="/informes"
          element={
            <PrivateRoute>
              <GenerarInforme />
            </PrivateRoute>
          }
        />
        <Route
          path="/modificar/:id"
          element={
            <PrivateRoute>
              <ModificarExpediente />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
