import React, { useState } from "react";
import { X, CheckCircle, Unlock, MessageSquare, Clock, Send, User, MapPin } from "lucide-react";
import "./ReportDetailModal.css";

export default function ReportDetailModal({ 
  reporte, 
  onClose, 
  onAction, 
  traducirEstado,
  handleImageError 
}) {
  const [nuevoComentario, setNuevoComentario] = useState("");

  // --- 💬 SIMULACIÓN DE CHAT (Bitácora) ---
  const comentariosSimulados = [
    {
      id: 1,
      texto: "Reporte recibido. Se ha generado la orden de trabajo OT-9928 para la cuadrilla de alumbrado.",
      fecha: "20 ene, 09:30 AM",
      autor: "Admin User",
      rol: "ADMIN"
    },
    {
      id: 2,
      texto: "Muchas gracias, ¿saben cuándo podrían venir? La calle está muy oscura.",
      fecha: "20 ene, 10:15 AM",
      autor: "Ciudadano",
      rol: "CITIZEN"
    },
    {
      id: 3,
      texto: "Está programado para mañana por la mañana. Le notificaremos cuando el técnico esté en camino.",
      fecha: "20 ene, 10:45 AM",
      autor: "Admin User",
      rol: "ADMIN"
    },
    {
      id: 4,
      texto: "Entendido, quedo a la espera.",
      fecha: "20 ene, 11:00 AM",
      autor: "Ciudadano",
      rol: "CITIZEN"
    }
  ];

  if (!reporte) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-detail" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close-modal" onClick={onClose}><X size={20} /></button>
        
        <div className="modal-content-grid">
          
          {/* --- COLUMNA IZQUIERDA: FOTO E INFO --- */}
          <div className="detail-visual">
            <div className="image-wrapper">
                <img 
                  src={reporte.foto} 
                  alt="Evidencia" 
                  className="detail-img" 
                  onError={handleImageError} 
                />
            </div>
            
            <div className="detail-info-block">
              <div className={`status-pill large ${reporte.estado === 'PENDING' ? 'status-pending' : reporte.estado === 'DONE' ? 'status-done' : reporte.estado === 'REJECTED' ? 'status-rejected' : 'status-process'}`} style={{marginBottom:'10px', alignSelf:'flex-start'}}>
                {traducirEstado(reporte.estado)}
              </div>
              <h2>{reporte.tipo}</h2>
              
              <div className="action-buttons">
                {reporte.estado === 'PENDING' && (
                  <button className="btn-process" onClick={() => onAction("SEGUIMIENTO")}>
                    <Unlock size={16}/> Dar Seguimiento
                  </button>
                )}
                {reporte.estado !== 'DONE' && reporte.estado !== 'REJECTED' && (
                  <>
                    <button className="btn-finalizar" onClick={() => onAction("FINALIZAR")}>
                      <CheckCircle size={16} /> Finalizar
                    </button>
                    <button className="btn-rechazar" onClick={() => onAction("RECHAZAR")}>
                      <X size={16} /> Rechazar
                    </button>
                  </>
                )}
              </div>

              <div className="description-box">
                <label>DESCRIPCIÓN DEL REPORTE</label>
                <p>{reporte.descripcion}</p>
              </div>
            </div>
          </div>

          {/* --- COLUMNA DERECHA: CHAT Y DATOS --- */}
          <div className="detail-tracking">
            <div className="metadata-section">
              <div className="meta-item"><label>Folio</label><p>{reporte.folio}</p></div>
              <div className="meta-item"><label>Fecha</label><p>{reporte.fecha}</p></div>
              <div className="meta-item"><label>Usuario</label><p>{reporte.usuario}</p></div>
              <div className="meta-item">
                <label>Zona</label>
                <p>
                  {reporte.lat && reporte.lng ? (
                    <a 
                      href={`https://www.google.com/maps/place/${reporte.lat},${reporte.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#3b82f6',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontWeight: '500'
                      }}
                      title="Ver ubicación en Google Maps"
                    >
                      <MapPin size={14} />
                      {reporte.colonia}
                    </a>
                  ) : (
                    reporte.colonia
                  )}
                </p>
              </div>
              {reporte.referencias && reporte.referencias !== "Sin detalles disponibles." && (
                <div className="meta-item">
                  <label>Referencias</label>
                  <p>{reporte.referencias}</p>
                </div>
              )}
            </div>

            <div className="tracking-header"><MessageSquare size={18} /><h3>Bitácora de Seguimiento</h3></div>
            
            {/* AREA DE CHAT CON SCROLL */}
            <div className="comments-list">
              
              <div className="chat-system-msg">
                <Clock size={28} />
                <p>Reporte creado el {reporte.fecha}</p>
              </div>

              {comentariosSimulados.map((msg) => (
                <div key={msg.id} className={`chat-bubble ${msg.rol === 'ADMIN' ? 'admin' : 'citizen'}`}>
                    <div className="chat-meta">
                        <span className="chat-author">{msg.autor}</span>
                        <span className="chat-time">{msg.fecha}</span>
                    </div>
                    <p className="chat-text">{msg.texto}</p>
                </div>
              ))}

            </div>

            <div className="comment-input-area">
              <input 
                type="text" 
                placeholder="Escribe una actualización..." 
                value={nuevoComentario} 
                onChange={(e) => setNuevoComentario(e.target.value)} 
              />
              <button className="btn-send"><Send size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}