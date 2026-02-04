import React, { useState } from 'react';
import { X, Calendar, Users, UserPlus, Send, Clock, AlertTriangle, MapPin, BarChart2, Trophy, Award, CheckCircle } from 'lucide-react';
import './Dashboard.css';

const DashboardCorteSemanal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [semanaId, setSemanaId] = useState('sem1');

  // --- DATOS MOCK ACTUALIZADOS ---
  const dataPorSemana = {
    sem1: {
      label: "Semana 1 (1 - 7 Ene)",
      kpi: { usuarios: 120, nuevas: 15, reportes: 98, tiempo: '12m', crecimiento: '+5%' },
      problemas: { luz: '40%', agua: '30%', baches: '30%' },
      estatus: { exitoso: '65%', proceso: '25%', rechazado: '10%' },
      zonas: [{ n: 'Miralta', v: 40 }, { n: 'Centro', v: 30 }, { n: 'Mangos', v: 28 }],
      topUsers: [
        { id: 1, nombre: "Juan Perez", reportes: 12, estado: "Verificado" },
        { id: 2, nombre: "Maria Goméz", reportes: 10, estado: "Nuevo" },
        { id: 3, nombre: "Luis Solis", reportes: 8, estado: "Verificado" }
      ]
    },
    sem2: {
      label: "Semana 2 (8 - 14 Ene)",
      kpi: { usuarios: 340, nuevas: 45, reportes: 210, tiempo: '15m', crecimiento: '+12%' },
      problemas: { luz: '20%', agua: '50%', baches: '30%' },
      estatus: { exitoso: '70%', proceso: '20%', rechazado: '10%' },
      zonas: [{ n: 'Altamira', v: 80 }, { n: 'Pedrera', v: 60 }, { n: 'Centro', v: 50 }],
      topUsers: [
        { id: 1, nombre: "Ana Lopez", reportes: 25, estado: "Verificado" },
        { id: 2, nombre: "Carlos R.", reportes: 20, estado: "Verificado" },
        { id: 3, nombre: "Diana M.", reportes: 15, estado: "Nuevo" }
      ]
    },
  };

  const currentData = dataPorSemana[semanaId] || dataPorSemana['sem1'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content xl" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="modal-header">
          <div className="weekly-modal-header" style={{width: '100%', padding: 0}}>
            <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
               <div className="icon-bg-calendar"><Calendar size={24} color="#0b66ff"/></div>
               <div>
                 <h2 style={{fontSize:'22px'}}>Análisis por Corte Semanal</h2>
                 <p>Visualizando datos específicos del periodo seleccionado</p>
               </div>
            </div>
            <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                <select className="week-selector" value={semanaId} onChange={(e) => setSemanaId(e.target.value)}>
                    <option value="sem1">Semana 1 (1 - 7 Ene)</option>
                    <option value="sem2">Semana 2 (8 - 14 Ene)</option>
                </select>
                <button className="close-btn" onClick={onClose}><X size={24} /></button>
            </div>
          </div>
        </div>

        <div className="modal-body" style={{padding: '24px', background: '#f8fafc'}}>
            
            {/* 1. KPI CARDS */}
            <div className="stats-grid" style={{marginBottom: '30px'}}>
                <div className="card">
                    <div className="stat-header">
                        <div><span className="stat-title">Usuarios Activos</span><div className="stat-value">{currentData.kpi.usuarios}</div></div>
                        <div className="stat-icon"><Users size={18}/></div>
                    </div>
                    {/* Dato extra opcional */}
                    <div><span className="stat-sub">En la plataforma</span></div>
                </div>

                <div className="card">
                    <div className="stat-header">
                        <div><span className="stat-title">Nuevas Cuentas</span><div className="stat-value">{currentData.kpi.nuevas}</div></div>
                        <div className="stat-icon"><UserPlus size={18}/></div>
                    </div>
                    {/* 👇 AQUÍ AGREGUÉ EL COMPARATIVO QUE FALTABA */}
                    <div><span className="stat-change positive">{currentData.kpi.crecimiento} vs semana anterior</span></div>
                </div>

                <div className="card">
                    <div className="stat-header">
                        <div><span className="stat-title">Reportes</span><div className="stat-value">{currentData.kpi.reportes}</div></div>
                        <div className="stat-icon"><Send size={18}/></div>
                    </div>
                    <div><span className="stat-sub">Total generados</span></div>
                </div>

                <div className="card">
                    <div className="stat-header">
                        <div><span className="stat-title">Efectividad</span><div className="stat-value" style={{color:'#16a34a'}}>{currentData.estatus.exitoso}</div></div>
                        <div className="stat-icon"><Award size={18}/></div>
                    </div>
                    <div><span className="stat-sub">Casos resueltos</span></div>
                </div>
            </div>

            {/* 2. GRÁFICAS (GRID DE 4) */}
            <div className="charts-wrapper" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
                
                {/* A) ESTATUS DE REPORTES */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div><h3>Estatus</h3><p>Eficiencia semanal</p></div>
                        <CheckCircle size={18} color="#9ca3af" />
                    </div>
                    <div style={{display:'flex', flexDirection:'column', gap:'15px', justifyContent:'center', height:'150px'}}>
                        <div>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}><span>✅ Exitosos</span><span>{currentData.estatus.exitoso}</span></div>
                            <div style={{background:'#f3f4f6', height:'8px', borderRadius:'4px'}}><div style={{width: currentData.estatus.exitoso, background:'#16a34a', height:'100%', borderRadius:'4px'}}></div></div>
                        </div>
                        <div>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}><span>🔵 En Proceso</span><span>{currentData.estatus.proceso}</span></div>
                            <div style={{background:'#f3f4f6', height:'8px', borderRadius:'4px'}}><div style={{width: currentData.estatus.proceso, background:'#3b82f6', height:'100%', borderRadius:'4px'}}></div></div>
                        </div>
                        <div>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}><span>🔴 Rechazados</span><span>{currentData.estatus.rechazado}</span></div>
                            <div style={{background:'#f3f4f6', height:'8px', borderRadius:'4px'}}><div style={{width: currentData.estatus.rechazado, background:'#ef4444', height:'100%', borderRadius:'4px'}}></div></div>
                        </div>
                    </div>
                </div>

                {/* B) Problemáticas */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div><h3>Problemáticas</h3><p>De esta semana</p></div>
                        <AlertTriangle size={18} color="#9ca3af" />
                    </div>
                    <div style={{display:'flex', flexDirection:'column', gap:'15px', justifyContent:'center', height:'150px'}}>
                        <div>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}><span>💡 Luz</span><span>{currentData.problemas.luz}</span></div>
                            <div style={{background:'#f3f4f6', height:'8px', borderRadius:'4px'}}><div style={{width: currentData.problemas.luz, background:'#fbbf24', height:'100%', borderRadius:'4px'}}></div></div>
                        </div>
                        <div>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}><span>💧 Agua</span><span>{currentData.problemas.agua}</span></div>
                            <div style={{background:'#f3f4f6', height:'8px', borderRadius:'4px'}}><div style={{width: currentData.problemas.agua, background:'#3b82f6', height:'100%', borderRadius:'4px'}}></div></div>
                        </div>
                    </div>
                </div>

                {/* C) Zonas */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div><h3>Zonas Críticas</h3><p>Top lugares</p></div>
                        <MapPin size={18} color="#9ca3af" />
                    </div>
                    <div style={{display:'flex', flexDirection:'column', gap:'10px', justifyContent:'center', height:'150px'}}>
                        {currentData.zonas.map((zona, idx) => (
                            <div key={idx} style={{display:'flex', justifyContent:'space-between', fontSize:'13px', borderBottom:'1px solid #f3f4f6', paddingBottom:'5px'}}>
                                <span>{zona.n}</span>
                                <span style={{fontWeight:'700', color:'#2563eb'}}>{zona.v}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* D) Demografía */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div><h3>Demografía</h3><p>Edad promedio</p></div>
                        <BarChart2 size={18} color="#9ca3af" />
                    </div>
                    <div className="bar-chart-container" style={{height:'150px'}}>
                        <div className="bar-group"><div className="bar" style={{height: '40%', background: '#111827'}}></div><span>12-25</span></div>
                        <div className="bar-group"><div className="bar" style={{height: '70%', background: '#2563eb'}}></div><span>26-45</span></div>
                        <div className="bar-group"><div className="bar" style={{height: '30%', background: '#111827'}}></div><span>46+</span></div>
                    </div>
                </div>
            </div>

            {/* 3. TABLA */}
            <div className="top-users-section card" style={{marginBottom: 0}}>
                <div className="chart-header">
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <div className="icon-bg-trophy"><Trophy size={20} color="#ca8a04" /></div>
                        <div><h3>Mejores Ciudadanos (Semanal)</h3><p>Ranking del periodo seleccionado</p></div>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="users-table">
                        <thead><tr><th>#</th><th>Usuario</th><th>Reportes</th><th>Estado</th></tr></thead>
                        <tbody>
                            {currentData.topUsers.map((user, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td className="font-medium">{user.nombre}</td>
                                    <td><div className="report-count"><Award size={14} />{user.reportes}</div></td>
                                    <td><span className={`status-badge ${user.estado === 'Verificado' ? 'verified' : 'new'}`}>{user.estado}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <div className="modal-footer">
            <p>Mostrando datos del corte: <strong>{currentData.label}</strong></p>
            <button className="btn-primary-modal" onClick={onClose}>Cerrar Análisis</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCorteSemanal;