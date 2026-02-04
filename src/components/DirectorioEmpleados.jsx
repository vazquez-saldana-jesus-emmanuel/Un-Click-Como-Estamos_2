import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowUpDown, Plus, ChevronLeft, ChevronRight, Trash2,
  AlertTriangle, Power 
} from 'lucide-react';

import Navbar from "./Navbar";
import './DirectorioEmpleados.css';
import CreateUserModal from "./CreateUserModal";
import { getToken } from "../utils/auth";
import { API_URL } from "../utils/constants"; 

const DirectorioEmpleados = () => {
  const [empleados, setEmpleados] = useState([]); 
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [cargando, setCargando] = useState(false);

  const canManageUsers = true; 

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;

  // ==========================================
  // 1. CARGAR EMPLEADOS (VERSIÓN ROBUSTA)
  // ==========================================
  const cargarEmpleados = async () => {
    setCargando(true);
    try {
      const token = getToken();
      
      // ⚠️ PRUEBA DE FUEGO: Quitamos '?role=employee' para ver SI ALGO LLEGA.
      // Si esto funciona, el problema era el filtro de mayúsculas/minúsculas.
      const url = `${API_URL}/api/users`; 
      
      console.log("📡 Solicitando a:", url);

      const response = await fetch(url, {
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error(`Error API: ${response.status}`);

      const respuestaRaw = await response.json();
      console.log("📦 Respuesta CRUDO del Backend:", respuestaRaw);

      // --- LÓGICA UNIVERSAL PARA ENCONTRAR EL ARREGLO ---
      let listaFinal = [];

      if (respuestaRaw.data && Array.isArray(respuestaRaw.data)) {
         // CASO 1: Viene dentro de { data: [...] } (Tu caso actual)
         console.log("✅ Detectado formato { data: [...] }");
         listaFinal = respuestaRaw.data;
      } else if (Array.isArray(respuestaRaw)) {
         // CASO 2: Viene directo [...]
         console.log("✅ Detectado formato Arreglo Directo [...]");
         listaFinal = respuestaRaw;
      } else {
         console.warn("⚠️ No encontré un arreglo en la respuesta. Revisa la consola.");
      }

      console.log(`🔢 Se encontraron ${listaFinal.length} usuarios.`);

      const usuariosFormateados = listaFinal.map(u => ({
        id: u.id,
        nombre: u.name,
        email: u.email,
        telefono: u.phone || "Sin registrar",
        cargo: (u.role === 'ADMIN') ? 'Administrador' : 'Empleado', 
        role: u.role,
        estado: (u.status === 'ACTIVE') ? 'Activo' : 'Inactivo', 
        statusRaw: u.status, 
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&color=fff`
      }));

      setEmpleados(usuariosFormateados);

    } catch (error) {
      console.error("❌ Error grave al cargar:", error);
      setEmpleados([]);
    } finally {
        setCargando(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  // --- LÓGICA DE FILTROS ---
  const empleadosProcesados = useMemo(() => {
    let resultado = empleados;
    if (busqueda) {
      const lowerBusqueda = busqueda.toLowerCase();
      resultado = resultado.filter(emp => 
        (emp.nombre || "").toLowerCase().includes(lowerBusqueda) ||
        (emp.cargo || "").toLowerCase().includes(lowerBusqueda) ||
        (emp.email || "").toLowerCase().includes(lowerBusqueda)
      );
    }
    if (filtroEstado !== "Todos") {
      resultado = resultado.filter(emp => emp.estado === filtroEstado);
    }
    resultado = [...resultado].sort((a, b) => {
      const nombreA = a.nombre || "";
      const nombreB = b.nombre || "";
      if (ordenAscendente) return nombreA.localeCompare(nombreB);
      else return nombreB.localeCompare(nombreA);
    });
    return resultado;
  }, [empleados, busqueda, filtroEstado, ordenAscendente]);

  const totalPaginas = Math.ceil(empleadosProcesados.length / itemsPorPagina);
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const empleadosVisibles = empleadosProcesados.slice(indicePrimerItem, indiceUltimoItem);

  const manejarBusqueda = (e) => { setBusqueda(e.target.value); setPaginaActual(1); };
  const manejarFiltroEstado = (e) => { setFiltroEstado(e.target.value); setPaginaActual(1); };
  const alternarOrden = () => setOrdenAscendente(!ordenAscendente);
  
  // --- 2. ELIMINAR USUARIO ---
  const confirmarEliminacion = (id) => { setEmpleadoAEliminar(id); setShowDeleteModal(true); };
  
  const ejecutarEliminacion = async () => {
    if (empleadoAEliminar) {
      try {
        const token = getToken();
        const response = await fetch(`${API_URL}/api/users/${empleadoAEliminar}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            await cargarEmpleados(); 
            cerrarModalEliminacion();
        } else {
            alert("Error al eliminar. Verifica permisos.");
        }
      } catch (error) {
        alert("Error de conexión.");
      }
    }
  };
  const cerrarModalEliminacion = () => { setShowDeleteModal(false); setEmpleadoAEliminar(null); };

  // --- 3. CAMBIAR ESTATUS (PATCH) ---
  const alternarEstadoUsuario = async (id) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: 'PATCH',
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            await cargarEmpleados();
        } else {
            alert("No tienes permiso.");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión.");
    }
  };

  // --- 4. CREAR USUARIO ---
  const handleCreateUser = async (nuevoUsuario) => {
    try {
      const token = getToken();
      
      const roleForBody = nuevoUsuario.role === 'admin' ? 'ADMIN' : 'EMPLOYEE';
      // Mantenemos el param en la URL por si tu backend lo exige para crear
      const roleForUrl = nuevoUsuario.role === 'admin' ? 'admin' : 'employee';

      const payload = {
        name: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        password: nuevoUsuario.password,
        phone: nuevoUsuario.celular,
        role: roleForBody 
      };

      const response = await fetch(`${API_URL}/api/users?role=${roleForUrl}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await cargarEmpleados();
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Error al crear." };
      }
      
    } catch (error) {
      return { success: false, message: "Error de conexión." };
    }
  };

  const formatearID = (id) => { if (!id) return "#---"; return "#" + String(id).padStart(3, '0'); };

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="main-content-full">
        <div className="directory-container">
          
          <header className="directory-header">
            <div>
              <h1>Directorio de Empleados</h1>
              <p>Gestiona y visualiza la información de todo tu equipo de trabajo.</p>
            </div>
            
            {canManageUsers && (
              <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                <Plus size={18} />
                Añadir Empleado
              </button>
            )}
          </header>

          <div className="directory-card">
            <div className="toolbar">
              <div className="search-wrapper"><input type="text" placeholder="Buscar..." value={busqueda} onChange={manejarBusqueda} /></div>
              <div className="toolbar-actions">
                  <button className="btn-outline" onClick={alternarOrden}><ArrowUpDown size={16} /> {ordenAscendente ? "A-Z" : "Z-A"}</button>
                  <select className="status-select" value={filtroEstado} onChange={manejarFiltroEstado}>
                    <option value="Todos">Todos</option><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option>
                  </select>
              </div>
            </div>

             <div className="table-responsive">
              <table className="employee-table">
                <thead><tr><th>EMPLEADO</th><th>CARGO</th><th>EMAIL</th><th>CELULAR</th><th>ESTADO</th>
                <th className="text-right">ACCIONES</th></tr></thead>
                <tbody>
                  {cargando ? (
                      <tr><td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>Cargando directorio...</td></tr>
                  ) : empleadosVisibles.length > 0 ? (
                    empleadosVisibles.map((emp) => (
                      <tr key={emp.id}>
                        <td>
                           <div className="employee-info">
                             <img src={emp.avatar} alt={emp.nombre} className="avatar" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${emp.nombre}` }} />
                             <div><span className="emp-name">{emp.nombre}</span><span className="emp-id">ID: {formatearID(emp.id)}</span></div>
                           </div>
                        </td>
                        <td className="text-dark">{emp.cargo}</td>
                        <td className="text-blue">{emp.email}</td>
                        <td className="text-dark" style={{fontSize: '13px'}}>{emp.telefono}</td>
                        <td><span className={`status-badge ${emp.estado.toLowerCase()}`}>{emp.estado}</span></td>
                        
                        <td className="text-right">
                           <div style={{display:'flex', justifyContent:'flex-end', gap:'8px'}}>
                               <button 
                                 className="btn-icon status-hover" 
                                 title={emp.estado === 'Activo' ? "Desactivar usuario" : "Activar usuario"} 
                                 onClick={() => alternarEstadoUsuario(emp.id)}
                                 style={{color: emp.estado === 'Activo' ? '#F59E0B' : '#10B981'}}
                               >
                                 <Power size={18} />
                               </button>

                               <button className="btn-icon delete-hover" title="Eliminar" onClick={() => confirmarEliminacion(emp.id)}>
                                 <Trash2 size={18} />
                               </button>
                           </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>No hay empleados encontrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
             
             {totalPaginas > 1 && (
                <div className="pagination">
                  <button onClick={() => setPaginaActual(p => Math.max(1, p - 1))} disabled={paginaActual === 1}><ChevronLeft size={16}/></button>
                  <span>Página {paginaActual} de {totalPaginas}</span>
                  <button onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))} disabled={paginaActual === totalPaginas}><ChevronRight size={16}/></button>
                </div>
             )}
          </div>
        </div>
      </main>

      {showCreateModal && <CreateUserModal onClose={() => setShowCreateModal(false)} onCreateUser={handleCreateUser} />}
      
      {showDeleteModal && (
        <div className="modal-overlay">
           <div className="delete-modal-container">
              <div className="delete-modal-header"><AlertTriangle size={24} color="#991B1B" /><h3>¿Eliminar?</h3></div>
              <div className="delete-modal-body"><p>No podrás deshacer esta acción.</p></div>
              <div className="delete-modal-actions">
                 <button className="btn-outline" onClick={cerrarModalEliminacion}>Cancelar</button>
                 <button className="btn-danger" onClick={ejecutarEliminacion}>Sí, eliminar</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
export default DirectorioEmpleados;