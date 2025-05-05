// client/src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
            <button onClick={() => navigate('/crear')}>Crear expediente</button>
            <button onClick={() => navigate('/informes')}>Generar informe</button>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </nav>
    );
}

export default Navbar;
