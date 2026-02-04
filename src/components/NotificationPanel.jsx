import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import "./NotificationPanel.css";
// Importamos las funciones de la BD
import { getNotifications, clearNotifications } from "../Base_datos/db.jsx"; 

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]); // Iniciamos vacío
  const panelRef = useRef(null);

  // Función auxiliar para formatear fecha (ej: "Hace 5 min")
  const formatearFecha = (fecha) => {
    const ahora = new Date();
    const fechaObj = new Date(fecha);
    const diffMs = ahora - fechaObj;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMins / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMins < 1) return "Justo ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHoras < 24) return `Hace ${diffHoras} horas`;
    return `Hace ${diffDias} días`;
  };

  // Cargar datos reales
  const cargarDatos = async () => {
    const data = await getNotifications();
    setNotificaciones(data);
  };

  useEffect(() => {
    // 1. Carga inicial
    cargarDatos();

    // 2. Escuchar el evento "notificationUpdate" (cuando se crea un reporte)
    const handleUpdate = () => cargarDatos();
    window.addEventListener("notificationUpdate", handleUpdate);

    // 3. Cerrar al hacer click fuera
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("notificationUpdate", handleUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const borrarTodas = async () => {
    await clearNotifications();
  };

  const noLeidas = notificaciones.filter(n => !n.leido).length;

  return (
    <div className="notification-wrapper" ref={panelRef}>
      <button 
        className="icon-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Ver notificaciones"
      >
        <Bell size={20} />
        {noLeidas > 0 && <span className="notification-badge">{noLeidas}</span>}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notif-header">
            <span className="notif-title">Notificaciones</span>
            {notificaciones.length > 0 && (
              <button 
                onClick={borrarTodas}
                style={{ fontSize: '12px', color: '#0066FF', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Borrar todo
              </button>
            )}
          </div>

          <div className="notif-list">
            {notificaciones.length > 0 ? (
              notificaciones.map((item) => (
                <div key={item.id} className={`notif-item ${!item.leido ? 'unread' : ''}`}>
                  <div style={{ marginBottom: '4px' }}>{item.texto}</div>
                  {/* Usamos nuestra función de formateo */}
                  <small style={{ fontSize: '11px', color: '#9ca3af' }}>
                    {formatearFecha(item.fecha)}
                  </small>
                </div>
              ))
            ) : (
              <div className="notif-empty">
                Sin novedades por ahora.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}