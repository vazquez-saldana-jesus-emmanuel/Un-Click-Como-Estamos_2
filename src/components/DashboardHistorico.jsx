import React from 'react';
import { Users, UserPlus, Send, Clock, AlertTriangle, MapPin, Trophy, Award, Calendar, BarChart2, CheckCircle } from 'lucide-react';

const DashboardHistorico = ({ data, onOpenModal, onOpenWeekly }) => {
  
  // Datos simulados para la tabla de ranking (Top 5)
  const topUsuarios = [
    { id: 1, nombre: "Carlos Rodriguez", reportes: 154, zona: "Centro", estado: "Verificado" },
    { id: 2, nombre: "Ana López", reportes: 142, zona: "Norte", estado: "Verificado" },
    { id: 3, nombre: "Miguel Ángel", reportes: 128, zona: "Industrial", estado: "Verificado" },
    { id: 4, nombre: "Lucía Fernández", reportes: 115, zona: "Sur", estado: "Nuevo" },
    { id: 5, nombre: "Roberto Gómez", reportes: 98, zona: "Centro", estado: "Verificado" },
  ];

  const topColonias = [
    { nombre: "Miralta", total: 450, porcentaje: "35%" },
    { nombre: "Altamira Centro", total: 320, porcentaje: "25%" },
    { nombre: "Fraccionamiento Los Mangos", total: 210, porcentaje: "15%" },
  ];

  return (
    <>
      {/* BOTÓN SUPERIOR PARA ABRIR ANÁLISIS SEMANAL */}
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
        <button className="btn-weekly-trigger" onClick={onOpenWeekly}>
            <Calendar size={18} /> Ver Análisis por Cortes Semanales
        </button>
      </div>

      {/* 1. TARJETAS DE MÉTRICAS (KPIs) */}
      <div className="stats-grid">
        <div className="card">
            <div className="stat-header">
                <div><span className="stat-title">Usuarios Totales</span><div className="stat-value">{data.usuarios}</div></div>
                <div className="stat-icon"><Users size={18} /></div>
            </div>
            <div><span className="stat-sub">{data.subtitulo}</span></div>
        </div>
        <div className="card">
            <div className="stat-header">
                <div><span className="stat-title">Nuevas Cuentas</span><div className="stat-value">{data.nuevas}</div></div>
                <div className="stat-icon"><UserPlus size={18} /></div>
            </div>
            <div><span className="stat-change positive">+5% vs mes anterior</span></div>
        </div>
        <div className="card">
            <div className="stat-header">
                <div><span className="stat-title">Reportes Hist.</span><div className="stat-value">{data.reportes}</div></div>
                <div className="stat-icon"><Send size={18} /></div>
            </div>
        </div>
        <div className="card">
            <div className="stat-header">
                <div><span className="stat-title">Tiempo Promedio</span><div className="stat-value">{data.tiempo}</div></div>
                <div className="stat-icon"><Clock size={18} /></div>
            </div>
        </div>
      </div>

      {/* 2. GRÁFICAS GLOBALES (GRID DE 4 COLUMNAS) */}
      <div className="charts-wrapper" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
        
        {/* --- NUEVA GRÁFICA: ESTATUS DE REPORTES --- */}
        <div className="chart-card">
          <div className="chart-header">
            <div><h3>Estatus Global</h3><p>Eficiencia histórica</p></div>
            <CheckCircle size={18} color="#9ca3af" />
          </div>
          <div style={{ height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px' }}>
             <div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}><span>✅ Exitosos</span><span>60%</span></div>
                <div style={{background:'#f3f4f6', height:'8px', borderRadius:'4px'}}><div style={{width:'60%', background:'#16a34a', height:'100%', borderRadius:'4px'}}></div></div>
             </div>
             <div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}><span>🔵 En Proceso</span><span>30%</span></div>
                <div style={{background:'#f3f4f6', height:'8px', borderRadius:'4px'}}><div style={{width:'30%', background:'#3b82f6', height:'100%', borderRadius:'4px'}}></div></div>
             </div>
             <div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}><span>🔴 Rechazados</span><span>10%</span></div>
                <div style={{background:'#f3f4f6', height:'8px', borderRadius:'4px'}}><div style={{width:'10%', background:'#ef4444', height:'100%', borderRadius:'4px'}}></div></div>
             </div>
          </div>
        </div>

        {/* GRÁFICA: PROBLEMÁTICAS */}
        <div className="chart-card">
          <div className="chart-header">
            <div><h3>Problemáticas</h3><p>Más frecuentes</p></div>
            <AlertTriangle size={18} color="#9ca3af" />
          </div>
          <div style={{ height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px' }}>
             <div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}><span style={{fontWeight:'600'}}>💡 Luz</span><span>45%</span></div>
                <div style={{background:'#f3f4f6', height:'8px', borderRadius:'4px'}}><div style={{width:'45%', background:'#fbbf24', height:'100%', borderRadius:'4px'}}></div></div>
             </div>
             <div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}><span style={{fontWeight:'600'}}>💧 Agua</span><span>30%</span></div>
                <div style={{background:'#f3f4f6', height:'8px', borderRadius:'4px'}}><div style={{width:'30%', background:'#3b82f6', height:'100%', borderRadius:'4px'}}></div></div>
             </div>
             <div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}><span style={{fontWeight:'600'}}>🚧 Baches</span><span>25%</span></div>
                <div style={{background:'#f3f4f6', height:'8px', borderRadius:'4px'}}><div style={{width:'25%', background:'#ef4444', height:'100%', borderRadius:'4px'}}></div></div>
             </div>
          </div>
        </div>

        {/* GRÁFICA: ZONAS CRÍTICAS */}
        <div className="chart-card">
            <div className="chart-header">
              <div><h3>Zonas Críticas</h3><p>Mayor actividad</p></div>
              <MapPin size={18} color="#9ca3af" />
            </div>
            <div className="zones-list-container">
                {topColonias.map((colonia, index) => (
                  <div key={index} className="zone-item" style={{display:'flex', flexDirection:'column', gap:'4px', marginBottom:'10px'}}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                         <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                            <span style={{background: '#f1f5f9', color:'#64748b', fontSize:'10px', fontWeight:'800', width:'18px', height:'18px', borderRadius:'50%', display:'flex', justifyContent:'center', alignItems:'center'}}>{index + 1}</span>
                            <span style={{fontSize:'13px', fontWeight:'600', color:'#1e293b'}}>{colonia.nombre}</span>
                         </div>
                         <span style={{fontSize:'11px', color:'#3b82f6', fontWeight:'700'}}>{colonia.total} reps</span>
                      </div>
                      <div style={{width:'100%', height:'6px', background:'#f1f5f9', borderRadius:'10px', overflow:'hidden'}}>
                          <div style={{width: colonia.porcentaje, height:'100%', borderRadius:'10px', background: index === 0 ? 'linear-gradient(90deg, #3b82f6, #60a5fa)' : index === 1 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #10b981, #34d399)'}}></div>
                      </div>
                   </div>
                ))}
            </div>
        </div>

        {/* GRÁFICA: DEMOGRAFÍA */}
        <div className="chart-card">
          <div className="chart-header">
            <div><h3>Demografía</h3><p>Edad usuarios</p></div>
            <BarChart2 size={18} color="#9ca3af" />
          </div>
          <div className="demo-chart-container" style={{display:'flex', alignItems:'flex-end', justifyContent:'space-around', height:'180px', paddingBottom:'10px'}}>
             <div className="demo-group" style={{display:'flex', flexDirection:'column', alignItems:'center', height:'100%', width:'15%', justifyContent:'flex-end'}}>
                <div style={{height:'35%', width:'100%', background:'#e2e8f0', borderRadius:'6px 6px 0 0'}}></div>
                <span style={{fontSize:'12px', color:'#94a3b8', marginTop:'8px'}}>12-25</span>
             </div>
             <div className="demo-group" style={{display:'flex', flexDirection:'column', alignItems:'center', height:'100%', width:'15%', justifyContent:'flex-end'}}>
                <div style={{height:'80%', width:'100%', background:'linear-gradient(180deg, #3b82f6, #2563eb)', borderRadius:'6px 6px 0 0'}}></div>
                <span style={{fontSize:'12px', color:'#3b82f6', fontWeight:'700', marginTop:'8px'}}>26-45</span>
             </div>
             <div className="demo-group" style={{display:'flex', flexDirection:'column', alignItems:'center', height:'100%', width:'15%', justifyContent:'flex-end'}}>
                <div style={{height:'50%', width:'100%', background:'#e2e8f0', borderRadius:'6px 6px 0 0'}}></div>
                <span style={{fontSize:'12px', color:'#94a3b8', marginTop:'8px'}}>46-60</span>
             </div>
             <div className="demo-group" style={{display:'flex', flexDirection:'column', alignItems:'center', height:'100%', width:'15%', justifyContent:'flex-end'}}>
                <div style={{height:'20%', width:'100%', background:'#e2e8f0', borderRadius:'6px 6px 0 0'}}></div>
                <span style={{fontSize:'12px', color:'#94a3b8', marginTop:'8px'}}>61+</span>
             </div>
          </div>
        </div>
      </div>

      {/* 3. RANKING (TABLA INFERIOR) */}
      <div className="top-users-section card" style={{marginTop: '30px'}}>
          <div className="chart-header">
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <div className="icon-bg-trophy"><Trophy size={20} color="#ca8a04" /></div>
                  <div><h3>Top Ciudadanos (Global)</h3><p>Ranking histórico acumulado</p></div>
              </div>
              <button className="export-btn" onClick={onOpenModal}>Ver todos</button>
          </div>
          <div className="table-responsive">
              <table className="users-table">
                  <thead>
                      <tr><th>#</th><th>Usuario</th><th>Reps.</th><th>Estado</th></tr>
                  </thead>
                  <tbody>
                      {topUsuarios.map((usuario, index) => (
                          <tr key={usuario.id}>
                              <td>{index + 1}</td>
                              <td className="font-medium">{usuario.nombre}</td>
                              <td>{usuario.reportes}</td>
                              <td><span className={`status-badge ${usuario.estado === 'Verificado' ? 'verified' : 'new'}`}>{usuario.estado}</span></td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </>
  );
};

export default DashboardHistorico;