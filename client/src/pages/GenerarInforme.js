import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import Navbar from '../components/Navbar';

function GenerarInforme() {
    const [inicio, setInicio] = useState('');
    const [fin, setFin] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    const fetchExpedientes = async () => {
        const res = await axios.get(`http://localhost:5000/api/expedientes/rango?inicio=${inicio}&fin=${fin}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    };

    const handlePDF = async () => {
        if (!inicio || !fin) {
            setError('Debe seleccionar ambas fechas');
            return;
        }
        const data = await fetchExpedientes();
        const doc = new jsPDF();

        doc.text('Informe de Expedientes', 14, 15);
        autoTable(doc, {
            startY: 20,
            head: [['Número', 'DNI', 'Nombre', 'Apellidos', 'Tipo', 'Estado', 'Fecha', 'Unidad']],
            body: data.map(exp => [
                exp.numero,
                exp.dni,
                exp.nombre,
                exp.apellidos,
                exp.tipo,
                exp.estado,
                new Date(exp.fecha).toLocaleDateString(),
                exp.unidad
            ])
        })

        doc.save(`Informe_${inicio}_a_${fin}.pdf`);
    };

    const handleCSV = async () => {
        if (!inicio || !fin) {
            setError('Debe seleccionar ambas fechas');
            return;
        }
        const data = await fetchExpedientes();
        const csv = Papa.unparse(
            data.map(exp => ({
                numero: exp.numero,
                dni: exp.dni,
                nombre: exp.nombre,
                apellidos: exp.apellidos,
                tipo: exp.tipo,
                estado: exp.estado,
                fecha: new Date(exp.fecha).toISOString().split('T')[0],
                unidad: exp.unidad
            }))
        );
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Informe_${inicio}_a_${fin}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '1rem' }}>
                <h2>Generar Informe</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div>
                    <label>Fecha de inicio:</label><br />
                    <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} /><br /><br />
                    <label>Fecha de fin:</label><br />
                    <input type="date" value={fin} onChange={e => setFin(e.target.value)} /><br /><br />
                </div>

                <button onClick={handlePDF}>Generar PDF</button>{' '}
                <button onClick={handleCSV}>Generar CSV</button>
            </div>
        </div>
    );
}

export default GenerarInforme;
