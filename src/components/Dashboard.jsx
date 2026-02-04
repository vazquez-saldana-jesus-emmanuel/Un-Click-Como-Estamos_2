import React, { useState } from 'react';
import Navbar from "./Navbar";
import DashboardVivo from "./DashboardVivo";
import DashboardHistorico from "./DashboardHistorico";
import RankingModal from "./RankingModal";
import DashboardCorteSemanal from "./DashboardCorteSemanal"; // <--- 1. IMPORTAR EL NUEVO MODAL
import './Dashboard.css';

const Dashboard = () => {
  const [filtro, setFiltro] = useState('vivo'); 
  
  // Estado para el modal de Ranking (Tabla grande)
  const [showRankingModal, setShowRankingModal] = useState(false);
  
  // Estado para el modal de Cortes Semanales (Nuevo)
  const [showWeeklyModal, setShowWeeklyModal] = useState(false); // <--- 2. NUEVO ESTADO

  const datosGenerales = {
    vivo: { 
      usuarios: 0, nuevas: 0, reportes: 0, tiempo: '--', 
      subtitulo: 'Esperando conexión websocket...' 
    },
    historico: { 
      usuarios: "12,450", nuevas: 340, reportes: "8,920", tiempo: '14m 30s', 
      subtitulo: 'Total acumulado global' 
    }
  };

  const dataActual = datosGenerales[filtro];

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="main-content-full">
        <div className="header-section">
          <div className="header-title">
            <h1>Métricas y Análisis</h1>
            <p>Visualización del rendimiento {filtro === 'vivo' ? 'en tiempo real' : 'global histórico'}.</p>
          </div>
          <div className="filters">
            <button className={`filter-btn ${filtro === 'vivo' ? 'active' : ''}`} onClick={() => setFiltro('vivo')}>En vivo</button>
            <button className={`filter-btn ${filtro === 'historico' ? 'active' : ''}`} onClick={() => setFiltro('historico')}>Histórico</button>
          </div>
        </div>

        {/* Renderizado Condicional de las Vistas */}
        {filtro === 'vivo' ? (
          <DashboardVivo data={dataActual} />
        ) : (
          <DashboardHistorico 
            data={dataActual} 
            onOpenModal={() => setShowRankingModal(true)} 
            onOpenWeekly={() => setShowWeeklyModal(true)} // <--- 3. CONECTAR EL BOTÓN AQUÍ
          />
        )}

      </main>

      {/* --- MODALES --- */}
      
      {/* 1. Modal de Ranking (Tabla) */}
      <RankingModal isOpen={showRankingModal} onClose={() => setShowRankingModal(false)} />
      
      {/* 2. Modal de Cortes Semanales (Nuevo) */}
      <DashboardCorteSemanal isOpen={showWeeklyModal} onClose={() => setShowWeeklyModal(false)} />

    </div>
  );
};

export default Dashboard;