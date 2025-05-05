// client/src/pages/Expedientes.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function Expedientes() {
    const [expedientes, setExpedientes] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [idEliminar, setIdEliminar] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://localhost:5000/api/expedientes', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setExpedientes(res.data))
            .catch(err => console.error(err));
    }, [token]);

    const confirmarEliminar = (id) => {
        setIdEliminar(id);
        setMostrarModal(true);
    };

    const eliminarExpediente = () => {
        axios.delete(`http://localhost:5000/api/expedientes/${idEliminar}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                setExpedientes(prev => prev.filter(e => e._id !== idEliminar));
                setMostrarModal(false);
            })
            .catch(err => console.error(err));
    };

    const expedientesFiltrados = expedientes.filter(e =>
        e.numero.toLowerCase().includes(filtro.toLowerCase()) ||
        e.dni.toLowerCase().includes(filtro.toLowerCase()) ||
        e.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        e.apellidos.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div>
            <Navbar />
            <div style={{ padding: '1rem' }}>
                <h2>Listado de Expedientes</h2>

                <input
                    type="text"
                    placeholder="Buscar por número, DNI, nombre o apellidos..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    style={{ marginBottom: '1rem', padding: '0.5rem', width: '400px' }}
                />

                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f0f0f0' }}>
                        <tr>
                            <th>Número</th>
                            <th>DNI</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Unidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expedientesFiltrados.map(exp => (
                            <tr key={exp._id}>
                                <td>{exp.numero}</td>
                                <td>{exp.dni}</td>
                                <td>{exp.nombre}</td>
                                <td>{exp.apellidos}</td>
                                <td>{exp.tipo}</td>
                                <td>{exp.estado}</td>
                                <td>{new Date(exp.fecha).toLocaleDateString()}</td>
                                <td>{exp.unidad}</td>
                                <td>
                                    <button onClick={() => navigate(`/modificar/${exp._id}`)}>Modificar</button>{' '}
                                    <button onClick={() => confirmarEliminar(exp._id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {mostrarModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0,
                        width: '100vw', height: '100vh',
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '10px' }}>
                            <p>¿Estás seguro de que quieres eliminar este expediente?</p>
                            <button onClick={eliminarExpediente}>Sí, eliminar</button>{' '}
                            <button onClick={() => setMostrarModal(false)}>Cancelar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Expedientes;

