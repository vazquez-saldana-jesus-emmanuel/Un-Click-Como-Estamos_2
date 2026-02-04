import React from 'react';
import { Users, UserPlus, Send, Clock, AlertTriangle, MapPin, CheckCircle } from 'lucide-react';

const DashboardVivo = ({ data }) => {
  return (
    <>
      {/* TARJETAS DE RESUMEN (EN VIVO) */}
      <div className="stats-grid">
        <div className="card">
          <div className="stat-header">
            <div><span className="stat-title">Usuarios Conectados</span><div className="stat-value">{data.usuarios}</div></div>
            <div className="stat-icon"><Users size={18} /></div>
          </div>
          <div><span className="stat-sub">{data.subtitulo}</span></div>
        </div>
        <div className="card">
          <div className="stat-header">
            <div><span className="stat-title">Nuevas Cuentas (Hoy)</span><div className="stat-value">{data.nuevas}</div></div>
            <div className="stat-icon"><UserPlus size={18} /></div>
          </div>
          <div><span className="stat-sub">Sin actividad reciente</span></div>
        </div>
        <div className="card">
          <div className="stat-header">
             <div><span className="stat-title">Reportes (Última hora)</span><div className="stat-value">{data.reportes}</div></div>
             <div className="stat-icon"><Send size={18} /></div>
          </div>
        </div>
        <div className="card">
           <div className="stat-header">
             <div><span className="stat-title">Latencia Promedio</span><div className="stat-value">{data.tiempo}</div></div>
             <div className="stat-icon"><Clock size={18} /></div>
           </div>
        </div>
      </div>

      {/* SECCIÓN DE GRÁFICAS (AHORA SON 3) */}
      <div className="charts-wrapper" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
        
        {/* 1. NUEVA GRÁFICA: ESTATUS EN VIVO */}
        <div className="chart-card">
          <div className="chart-header">
            <div><h3>Estatus en Vivo</h3><p>Flujo actual</p></div>
            <CheckCircle size={18} color="#9ca3af" />
          </div>
          <div style={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px' }}>
             {/* En vivo la mayoría están en proceso (azul) */}
             <div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}><span>✅ Exitosos</span><span>5%</span></div>
                <div style={{background:'#f3f4f6', height:'8px', borderRadius:'4px'}}><div style={{width:'5%', background:'#16a34a', height:'100%', borderRadius:'4px'}}></div></div>
             </div>
             <div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}><span>🔵 En Proceso</span><span>90%</span></div>
                <div style={{background:'#f3f4f6', height:'8px', borderRadius:'4px'}}><div style={{width:'90%', background:'#3b82f6', height:'100%', borderRadius:'4px'}}></div></div>
             </div>
             <div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}><span>🔴 Rechazados</span><span>5%</span></div>
                <div style={{background:'#f3f4f6', height:'8px', borderRadius:'4px'}}><div style={{width:'5%', background:'#ef4444', height:'100%', borderRadius:'4px'}}></div></div>
             </div>
          </div>
        </div>

        {/* 2. Actividad Real */}
        <div className="chart-card">
          <div className="chart-header">
            <div><h3>Actividad en Tiempo Real</h3><p>Monitor de eventos</p></div>
            <AlertTriangle size={18} color="#9ca3af" />
          </div>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="empty-chart-msg"><p>Esperando flujo de datos...</p></div>
          </div>
        </div>

        {/* 3. Mapa de Calor */}
        <div className="chart-card">
           <div className="chart-header">
             <div><h3>Mapa de Calor en Vivo</h3><p>Ubicación actual</p></div>
             <MapPin size={18} color="#9ca3af" />
           </div>
           <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <div className="empty-chart-msg"><p>Sin actividad geográfica...</p></div>
           </div>
        </div>
      </div>
    </>
  );
};

export default DashboardVivo;