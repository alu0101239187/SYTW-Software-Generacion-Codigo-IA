import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function ModificarExpediente() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [form, setForm] = useState({
        numero: '',
        dni: '',
        nombre: '',
        apellidos: '',
        tipo: '',
        estado: '',
        fecha: '',
        unidad: ''
    });

    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:5000/api/expedientes/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                const datos = res.data;
                setForm({
                    numero: datos.numero,
                    dni: datos.dni,
                    nombre: datos.nombre,
                    apellidos: datos.apellidos,
                    tipo: datos.tipo,
                    estado: datos.estado,
                    fecha: datos.fecha.split('T')[0], // solo yyyy-mm-dd
                    unidad: datos.unidad
                });
            })
            .catch(err => {
                console.error(err);
                setError('Error al cargar el expediente.');
            });
    }, [id, token]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = e => {
        e.preventDefault();

        // Validación básica
        const campos = Object.values(form);
        if (campos.some(c => c === '')) {
            setError('Todos los campos deben estar completos.');
            return;
        }

        axios.put(`http://localhost:5000/api/expedientes/${id}`, form, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => navigate('/'))
            .catch(err => {
                console.error(err);
                setError('Error al modificar el expediente.');
            });
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '1rem' }}>
                <h2>Modificar Expediente</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label>Número de expediente (no editable):</label><br />
                    <input type="text" name="numero" value={form.numero} disabled /><br /><br />

                    <label>DNI:</label><br />
                    <input type="text" name="dni" value={form.dni} onChange={handleChange} /><br /><br />

                    <label>Nombre:</label><br />
                    <input type="text" name="nombre" value={form.nombre} onChange={handleChange} /><br /><br />

                    <label>Apellidos:</label><br />
                    <input type="text" name="apellidos" value={form.apellidos} onChange={handleChange} /><br /><br />

                    <label>Tipo de petición:</label><br />
                    <select name="tipo" value={form.tipo} onChange={handleChange}>
                        <option value="">Seleccione...</option>
                        <option value="Contratos">Contratos</option>
                        <option value="Estadística">Estadística</option>
                        <option value="Institucional">Institucional</option>
                    </select><br /><br />

                    <label>Estado:</label><br />
                    <select name="estado" value={form.estado} onChange={handleChange}>
                        <option value="">Seleccione...</option>
                        <option value="Creada">Creada</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Estimada">Estimada</option>
                        <option value="Desestimada">Desestimada</option>
                    </select><br /><br />

                    <label>Fecha del expediente:</label><br />
                    <input type="date" name="fecha" value={form.fecha} onChange={handleChange} /><br /><br />

                    <label>Unidad administrativa:</label><br />
                    <input type="text" name="unidad" value={form.unidad} onChange={handleChange} /><br /><br />

                    <button type="button" onClick={() => navigate('/')}>Cancelar</button>{' '}
                    <button type="submit">Modificar expediente</button>
                </form>
            </div>
        </div>
    );
}

export default ModificarExpediente;
