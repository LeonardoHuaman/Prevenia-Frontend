import React from 'react';
import { FiUser } from 'react-icons/fi';
import './Topbar.css';

const Topbar = ({ clinicName, doctorName }) => {
  return (
    <header className="topbar">
      {/* Nombre de la clínica a la izquierda */}
      <h1 className="topbar-clinic">{clinicName}</h1>

      {/* A la derecha: nombre del doctor + icono de usuario */}
      <div className="topbar-doctor-info">
        <span className="topbar-doctor-name">{`Dr. ${doctorName}`}</span>
        <FiUser className="topbar-doctor-icon" size={28} />
      </div>
    </header>
  );
};

export default Topbar;
