// src/Pages/Pacientes/Pacientes.jsx

import React, { useState, useEffect } from 'react'
import Sidebar from '../../Components/Sidebar'
import Topbar from '../../Components/Topbar'
import './Pacientes.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiPlus, FiX } from 'react-icons/fi'

const Pacientes = () => {
  const navigate = useNavigate()
  const [doctorName, setDoctorName] = useState('')
  const [clinicName, setClinicName] = useState('')
  const [loadingDoctor, setLoadingDoctor] = useState(true)

  const [pacientes, setPacientes] = useState([])
  const [loadingPacientes, setLoadingPacientes] = useState(true)
  const [errorPacientes, setErrorPacientes] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    edad: '',
    celular: '',
    correo: '',
    foto: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  // 1) Validar token y obtener datos del doctor
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
      return
    }

    axios
      .get('http://localhost:8000/doctors/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((resp) => {
        setDoctorName(resp.data.nombre)
        setClinicName(resp.data.clinic_name)
        setLoadingDoctor(false)
      })
      .catch((err) => {
        console.error('Error al obtener perfil del doctor:', err)
        localStorage.removeItem('token')
        navigate('/')
      })
  }, [navigate])

  // 2) Obtener lista de pacientes
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    axios
      .get('http://localhost:8000/pacientes', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPacientes(response.data)
        setLoadingPacientes(false)
      })
      .catch((err) => {
        console.error('Error al obtener pacientes:', err)
        setErrorPacientes('No se pudo cargar la lista de pacientes.')
        setLoadingPacientes(false)
      })
  }, [navigate])

  // Manejo de inputs del formulario
  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'foto') {
      setFormData((prev) => ({ ...prev, foto: files[0] }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Submit del formulario para crear paciente
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const token = localStorage.getItem('token')
      const data = new FormData()
      data.append('dni', formData.dni)
      data.append('nombres', formData.nombres)
      data.append('apellidos', formData.apellidos)
      data.append('edad', formData.edad)
      data.append('celular', formData.celular)
      data.append('correo', formData.correo)
      data.append('foto', formData.foto)

      await axios.post('http://localhost:8000/register/paciente', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      // Refrescar lista de pacientes
      const response = await axios.get('http://localhost:8000/pacientes', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPacientes(response.data)
      setShowModal(false)
      setFormData({
        dni: '',
        nombres: '',
        apellidos: '',
        edad: '',
        celular: '',
        correo: '',
        foto: null,
      })
    } catch (err) {
      console.error('Error al crear paciente:', err)
      setSubmitError('Error al crear paciente. Verifica los datos.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mostrar indicador mientras carga info del doctor o pacientes
  if (loadingDoctor || loadingPacientes) {
    return (
      <div className="home-loading">
        <p>Cargando datos…</p>
      </div>
    )
  }

  // Mostrar error si falla cargar pacientes
  if (errorPacientes) {
    return (
      <div className="home-loading">
        <p style={{ color: 'red' }}>{errorPacientes}</p>
      </div>
    )
  }

  return (
    <div className="home-container">
      {/* Sidebar idéntico al Home */}
      <Sidebar doctorName={doctorName} onLogout={handleLogout} />

      <div className="home-content">
        {/* Topbar idéntico al Home */}
        <Topbar clinicName={clinicName} doctorName={doctorName} />

        {/* Main idéntico al Home */}
        <main className="home-main">
          <div className="pacientes-header">
            <h2>Pacientes</h2>
            <button
              className="btn-add-paciente"
              onClick={() => setShowModal(true)}
            >
              <FiPlus size={18} /> Agregar
            </button>
          </div>

          {pacientes.length === 0 ? (
            <p className="no-pacientes-text">No hay pacientes registrados aún.</p>
          ) : (
            <div className="pacientes-grid">
              {pacientes.map((p) => (
                <div key={p.id} className="paciente-card">
                  <div className="paciente-photo">
                    {p.foto ? (
                      <img
                        src={`http://localhost:8000/static/pacientes/${p.foto}`}
                        alt={`${p.nombres} ${p.apellidos}`}
                      />
                    ) : (
                      <div className="no-photo-placeholder" />
                    )}
                  </div>
                  <div className="paciente-info">
                    <h3 className="paciente-nombre">
                      {p.nombres} {p.apellidos}
                    </h3>
                    <p className="paciente-codigo">
                      DNI: {p.dni}
                    </p>
                    <p className="paciente-edad">Edad: {p.edad} años</p>
                    <p className="paciente-celular">Celular: {p.celular}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal para agregar paciente */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close-btn"
              onClick={() => {
                setShowModal(false)
                setSubmitError(null)
              }}
            >
              <FiX size={24} />
            </button>
            <h3>Agregar Nuevo Paciente</h3>
            <form className="paciente-form" onSubmit={handleSubmit}>
              <label>
                DNI:
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Nombres:
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Apellidos:
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Edad:
                <input
                  type="number"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </label>
              <label>
                Celular:
                <input
                  type="text"
                  name="celular"
                  value={formData.celular}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Correo:
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Foto:
                <input
                  type="file"
                  name="foto"
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </label>

              {submitError && (
                <p className="submit-error-text">{submitError}</p>
              )}

              <button
                type="submit"
                className="btn-submit-paciente"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pacientes
