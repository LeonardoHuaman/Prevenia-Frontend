// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';         
import Pacientes from './Pages/Pacientes/Pacientes';
import ProtectedRoute from './Components/ProtectedRoute'; 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes"
          element={
            <ProtectedRoute>
              <Pacientes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
