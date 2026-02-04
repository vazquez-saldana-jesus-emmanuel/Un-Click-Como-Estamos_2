import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react"; 
import { getCurrentUser } from "../utils/auth";

import Navbar from "./Navbar";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  // 1. ELIMINAMOS LA LÓGICA DE PERMISOS (isAdmin)
  // Ya no filtramos nada en el frontend.

  // Agregué user?.name por si tu API devuelve 'name' en lugar de 'username'
  const displayName = user?.username || user?.name || "Empleado";

  return (
    <div className="home-container">
      
      <Navbar />
      
      <main className="home-content">
        <h1 className="welcome-title">¡Bienvenido/a, {displayName}!</h1>

        <p className="subtitle">
          Este es tu punto de partida. Accede a tus reportes o visualiza el dashboard.
        </p>

        <div className="main-card">
          <div className="card-icon">
            <FileText size={36} color="#1D4ED8" />
          </div>

          <h2 className="card-title">Gestión de Reportes</h2>

          <p className="card-description">
            Crea, visualiza y gestiona tus reportes de actividad de forma rápida y sencilla.
          </p>

          <button className="primary-btn" onClick={() => navigate("/reportes")}>
            Acceder a Reportes
          </button>

          {/* 2. ENLACE AL DASHBOARD SIEMPRE VISIBLE 
              Quitamos la condición {isAdmin && ...} 
          */}
          <a 
            className="dashboard-link"
            onClick={() => navigate("/dashboard")} 
            style={{ cursor: "pointer" }}
          >
            O ver el dashboard de análisis
          </a>
          
        </div>
      </main>
    </div>
  );
}