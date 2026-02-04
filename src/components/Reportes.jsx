import React, { useState, useEffect } from "react";
import { User, Filter, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import "./Reportes.css";
import Navbar from "./Navbar";
import { getToken } from "../utils/auth";

// IMPORTAMOS LOS COMPONENTES QUE ACABAMOS DE CREAR
import ReporteDetailModal from "./ReportDetailModal";
import ConfirmModal from "./ConfirmModal";

const SERVER_URL = import.meta.env.VITE_API_URL;
const API_ENDPOINT = `${SERVER_URL}/api`;

export default function Reportes() {
  const [listaReportes, setListaReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 6; 

  const [filtros, setFiltros] = useState({
    estado: "Todos", colonia: "Todas", tipo: "Todos", ordenRiesgo: "Mayor" 
  });

  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  
  // Estado para el modal de confirmación
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, type: 'info', title: '', message: '', action: null
  });

  const NIVELES_RIESGO = { "Fuga": 3, "Bache": 2, "Alumbrado": 2, "Basura": 1 };

  // --- HELPERS ---
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/600x400?text=Sin+Imagen";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.includes("railway.app")) return `https://${imagePath}`;
    
    let cleanPath = imagePath.replace(/\\/g, "/").replace("public/", "");
    if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
    return `${SERVER_URL}/${cleanPath}`;
  };

  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = "https://via.placeholder.com/600x400?text=No+Disponible";
  };

  const cleanText = (text) => {
    if (!text || typeof text !== 'string') return "Sin detalles disponibles.";
    return text.replace(/^"|"$/g, '').replace(/\\"/g, '"');
  };

  const traducirEstado = (st) => {
    const map = { "PENDING": "Pendiente", "IN_PROGRESS": "En Proceso", "DONE": "Finalizado", "REJECTED": "Rechazado" };
    return map[st] || st;
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchReportes = async () => {
      setCargando(true);
      try {
        const token = getToken();
        const response = await fetch(`${API_ENDPOINT}/reports`, {
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Error al cargar");
        const result = await response.json();
        const dataArray = result.data || [];

        const reportesMapeados = dataArray.map(item => {
          const rutaImagenRaw = item.imageUrl || item.image || item.url; // Buscamos en varios campos por si acaso
          return {
            id: item.id,
            foto: getFullImageUrl(rutaImagenRaw),
            descripcion: cleanText(item.details),
            colonia: item.address?.neighborhood || "Ubicación General",
            direccion: item.address?.formattedAddress || cleanText(item.locationReferences),
            lat: item.latitude,
            lng: item.longitude,
            estado: item.status, 
            conteo: item.reportCount,
            tipo: item.category?.name || "General",
            usuario: item.user?.name || "Anónimo",
            folio: item.folio || "S/N",
            fecha: new Date(item.createdAt).toLocaleDateString("es-MX", { day: 'numeric', month: 'long', year: 'numeric' })
          };
        });
        setListaReportes(reportesMapeados);
      } catch (err) { console.error(err); } finally { setCargando(false); }
    };
    fetchReportes();
  }, []);

  // --- FILTROS ---
  const reportesFiltrados = listaReportes.filter(r => {
      const cumpleEstado = filtros.estado === "Todos" || traducirEstado(r.estado) === filtros.estado || r.estado === filtros.estado;
      const cumpleColonia = filtros.colonia === "Todas" || r.colonia === filtros.colonia;
      const cumpleTipo = filtros.tipo === "Todos" || r.tipo === filtros.tipo;
      return cumpleEstado && cumpleColonia && cumpleTipo;
  }).sort((a, b) => {
      if (filtros.ordenRiesgo === "Mayor") return (NIVELES_RIESGO[b.tipo] || 0) - (NIVELES_RIESGO[a.tipo] || 0);
      return 0;
  });

  const totalPaginas = Math.ceil(reportesFiltrados.length / itemsPorPagina);
  const indiceFinal = paginaActual * itemsPorPagina;
  const indiceInicial = indiceFinal - itemsPorPagina;
  const reportesPaginados = reportesFiltrados.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (n) => setPaginaActual(n);
  const cambiarFiltro = (key, val) => { setFiltros(prev => ({...prev, [key]: val})); setPaginaActual(1); };
  const limpiarFiltros = () => setFiltros({ estado: "Todos", colonia: "Todas", tipo: "Todos", ordenRiesgo: "Mayor" });
  const coloniasDisponibles = [...new Set(listaReportes.map(r => r.colonia))];

  // --- LÓGICA DE API ---
  const cambiarEstadoAPI = async (nuevoEstado) => {
    setConfirmModal({ ...confirmModal, isOpen: false }); 
    if (!reporteSeleccionado) return;
    
    try {
        const token = getToken();
        let estadoBackend = nuevoEstado;
        if(nuevoEstado === "En Proceso") estadoBackend = "IN_PROGRESS";
        if(nuevoEstado === "Finalizado") estadoBackend = "DONE";
        if(nuevoEstado === "Rechazado") estadoBackend = "REJECTED";

        const response = await fetch(`${API_ENDPOINT}/reports/${reporteSeleccionado.id}/status`, {
            method: 'PATCH',
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ status: estadoBackend })
        });
        
        if (!response.ok) throw new Error("Error al actualizar");

        // Actualizamos listas locales
        const nuevaLista = listaReportes.map(r => r.id === reporteSeleccionado.id ? { ...r, estado: estadoBackend } : r);
        setListaReportes(nuevaLista);
        setReporteSeleccionado(prev => ({ ...prev, estado: estadoBackend })); // Actualiza el modal abierto
    } catch (error) { console.error(error); alert("Error de conexión"); }
  };

  // --- MANEJADOR DE ACCIONES (Abre la ventanita pequeña) ---
  const handleActionRequest = (accion) => {
    if (accion === "SEGUIMIENTO") {
      setConfirmModal({ isOpen: true, type: 'info', title: '¿Iniciar Seguimiento?', message: 'El reporte pasará a estado "En Proceso".', action: () => cambiarEstadoAPI("En Proceso") });
    } else if (accion === "FINALIZAR") {
      setConfirmModal({ isOpen: true, type: 'success', title: '¿Finalizar Caso?', message: 'El reporte se marcará como resuelto.', action: () => cambiarEstadoAPI("Finalizado") });
    } else if (accion === "RECHAZAR") {
      setConfirmModal({ isOpen: true, type: 'danger', title: '¿Rechazar Reporte?', message: 'El reporte será desestimado irreversiblemente.', action: () => cambiarEstadoAPI("Rechazado") });
    }
  };

  return (
    <div className="reportes-container">
      <Navbar />
      <main className="reportes-content">
        <div className="content-header">
          <h1 className="page-title">Gestión de Reportes</h1>
          <p className="subtitle">Administración y seguimiento de incidencias ciudadanas</p>
        </div>

        <div className="filters-bar">
          <div className="filter-group"><Filter size={18} className="text-blue-500" /><span>Filtros:</span></div>
          <select className="filter-select" value={filtros.estado} onChange={(e) => cambiarFiltro("estado", e.target.value)}>
            <option value="Todos">Todos</option><option value="PENDING">Pendientes</option><option value="IN_PROGRESS">En Proceso</option><option value="DONE">Finalizados</option><option value="REJECTED">Rechazados</option> 
          </select>
          <select className="filter-select" value={filtros.tipo} onChange={(e) => cambiarFiltro("tipo", e.target.value)}>
            <option value="Todos">Todas las Categorías</option><option value="Alumbrado">Alumbrado</option><option value="Bache">Bacheo</option><option value="Fuga">Fuga de Agua</option><option value="Basura">Basura</option>
          </select>
          <select className="filter-select" value={filtros.colonia} onChange={(e) => cambiarFiltro("colonia", e.target.value)}>
            <option value="Todas">Todas las Colonias</option>{coloniasDisponibles.map((col, idx) => <option key={idx} value={col}>{col}</option>)}
          </select>
          <button onClick={limpiarFiltros} className="btn-reset-filters" title="Limpiar"><RotateCcw size={16}/></button>
        </div>

        {cargando ? <div style={{textAlign:'center', padding:'4rem', color:'#64748b'}}>Cargando datos...</div> : (
          <>
            <section className="report-grid">
              {reportesPaginados.map((reporte) => (
                <article key={reporte.id} className="report-card" onClick={() => setReporteSeleccionado(reporte)}>
                  <div className="card-image-container">
                    <img src={reporte.foto} alt="Evidencia" className="card-img" onError={handleImageError} />
                    <span className={`badge-tipo ${reporte.tipo.toLowerCase()}`}>{reporte.tipo}</span>
                  </div>
                  <div className="card-body">
                    <div className="user-info"><User size={14} /> <span>{reporte.usuario}</span></div>
                    <h4>{reporte.colonia}</h4><p className="card-desc">{reporte.descripcion}</p>
                    <div className="card-footer">
                        <div className={`status-pill ${reporte.estado === 'PENDING' ? 'status-pending' : reporte.estado === 'DONE' ? 'status-done' : reporte.estado === 'REJECTED' ? 'status-rejected' : 'status-process'}`}>{traducirEstado(reporte.estado)}</div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
            
            {/* PAGINACIÓN */}
            {totalPaginas > 1 && (
              <div className="pagination-container">
                <button className="page-btn" onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}><ChevronLeft size={20}/></button>
                <span style={{fontWeight:600, color:'#1e293b'}}>Página {paginaActual} de {totalPaginas}</span>
                <button className="page-btn" onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}><ChevronRight size={20}/></button>
              </div>
            )}
          </>
        )}
      </main>

      {/* RENDERIZADO DE COMPONENTES HIJOS */}
      
      {/* 1. Modal Grande de Detalle */}
      <ReporteDetailModal 
        reporte={reporteSeleccionado} 
        onClose={() => setReporteSeleccionado(null)} 
        onAction={handleActionRequest}
        traducirEstado={traducirEstado}
        handleImageError={handleImageError}
      />

      {/* 2. Modal Pequeño de Confirmación */}
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal({...confirmModal, isOpen: false})}
      />

    </div>
  );
}