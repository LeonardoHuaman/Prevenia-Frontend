// src/Pages/Home/Home.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/Sidebar';
import Topbar from '../../Components/Topbar';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios
      .get('http://localhost:8000/doctors/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((resp) => {
        setDoctorName(resp.data.nombre);
        setClinicName(resp.data.clinic_name);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener perfil del doctor:', err);
        localStorage.removeItem('token');
        navigate('/');
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="home-loading">
        <p>Cargando datos del doctor…</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Sidebar doctorName={doctorName} onLogout={handleLogout} />

      <div className="home-content">
        <Topbar clinicName={clinicName} doctorName={doctorName} />

        <main className="home-main">
        </main>
      </div>
    </div>
  );
};

export default Home;
