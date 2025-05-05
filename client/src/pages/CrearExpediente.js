import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function CrearExpediente() {
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
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (Object.values(form).some(val => val.trim() === '')) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/expedientes', form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al crear expediente');
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '1rem' }}>
                <h2>Crear Expediente</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div><label>Número de expediente:</label><br />
                        <input type="text" name="numero" value={form.numero} onChange={handleChange} />
                    </div>
                    <div><label>DNI:</label><br />
                        <input type="text" name="dni" value={form.dni} onChange={handleChange} />
                    </div>
                    <div><label>Nombre del solicitante:</label><br />
                        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} />
                    </div>
                    <div><label>Apellidos:</label><br />
                        <input type="text" name="apellidos" value={form.apellidos} onChange={handleChange} />
                    </div>
                    <div><label>Tipo de petición:</label><br />
                        <select name="tipo" value={form.tipo} onChange={handleChange}>
                            <option value="">Selecciona</option>
                            <option value="Contratos">Contratos</option>
                            <option value="Estadística">Estadística</option>
                            <option value="Institucional">Institucional</option>
                        </select>
                    </div>
                    <div><label>Estado de la petición:</label><br />
                        <select name="estado" value={form.estado} onChange={handleChange}>
                            <option value="">Selecciona</option>
                            <option value="Creada">Creada</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Estimada">Estimada</option>
                            <option value="Desestimada">Desestimada</option>
                        </select>
                    </div>
                    <div><label>Fecha de expediente:</label><br />
                        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} />
                    </div>
                    <div><label>Unidad administrativa:</label><br />
                        <input type="text" name="unidad" value={form.unidad} onChange={handleChange} />
                    </div>

                    <br />
                    <button type="button" onClick={() => navigate('/')}>Cancelar</button>{' '}
                    <button type="submit">Añadir expediente</button>
                </form>
            </div>
        </div>
    );
}

export default CrearExpediente;