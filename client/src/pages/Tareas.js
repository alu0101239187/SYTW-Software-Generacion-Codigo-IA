// client/src/pages/Tareas.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Tareas() {
    const [tareas, setTareas] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:5000/api/tareas', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => setTareas(response.data))
            .catch(error => console.log(error));
    }, []);

    return (
        <div>
            <h1>Tareas</h1>
            <ul>
                {tareas.map(tarea => (
                    <li key={tarea._id}>
                        <h3>{tarea.titulo}</h3>
                        <p>{tarea.descripcion}</p>
                        <p>{tarea.completada ? 'Completada' : 'Pendiente'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Tareas;
