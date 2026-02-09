import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, FileText, Users, Settings, LogOut, 
  Bell, Menu 
} from 'lucide-react';

import { logoutUser, getCurrentUser } from "../utils/auth";
import ProfileModal from "./ProfileModal";
import './Navbar.css'; 

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const user = getCurrentUser();

  // 1. ELIMINAMOS LA LÓGICA DE 'isAdmin'
  // Ya no filtramos el menú. Todos ven todo.
  
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const notifRef = useRef(null);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* ================= BARRA SUPERIOR ================= */}
      <header className="navbar-component">
        
        <div className="navbar-left">
          <button className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
            <Menu size={24} />
          </button>
          
          <div className="brand-container">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/9068/9068995.png" 
              alt="Logo" 
              className="app-logo" 
            />
            <span className="app-title">En un Click Como Estamos</span>
          </div>
        </div>

        <nav className="navbar-center-links">
          <a onClick={() => navigate("/home")}>Inicio</a>
        </nav>

        <div className="navbar-right">
          <div className="notification-wrapper" ref={notifRef}>
            <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} />
            </button>
            {showNotifications && (
              <div className="notification-panel">
                <div className="notif-title">Notificaciones</div>
                <div className="notif-item">Sin novedades.</div>
              </div>
            )}
          </div>

          <button className="icon-btn" onClick={() => navigate("/configuracion")}>
            <Settings size={20} />
          </button>

          <div className="user-avatar" onClick={() => setShowProfile(true)}>
             {user?.avatar ? <img src={user.avatar} alt="avatar" /> : (user?.nombre?.[0] || user?.username?.[0] || "A")}
          </div>

          <button className="icon-btn logout" onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* ================= MENÚ LATERAL ================= */}
      {showMenu && (
        <div className="side-menu-overlay">
           <div className="side-menu-content">
              <div className="menu-header">
                 <img src="https://cdn-icons-png.flaticon.com/512/9068/9068995.png" alt="" width="24"/>
                 <span>Menú</span>
              </div>

              <nav className="side-nav">
                
                {/* 2. DASHBOARD SIEMPRE VISIBLE */}
                {/* Quitamos la condición {isAdmin && ...} */}
                {location.pathname !== "/dashboard" && (
                  <button className="side-link" onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard size={18}/> Dashboard
                  </button>
                )}

                {/* REPORTES SIEMPRE VISIBLE */}
                {location.pathname !== "/reportes" && (
                  <button className="side-link" onClick={() => navigate("/reportes")}>
                    <FileText size={18}/> Reportes
                  </button>
                )}

                {/* 3. EMPLEADOS SIEMPRE VISIBLE */}
                {/* Quitamos la condición {isAdmin && ...} */}
                {location.pathname !== "/empleados" && (
                  <button className="side-link" onClick={() => navigate("/empleados")}>
                    <Users size={18}/> Empleados
                  </button>
                )}
                
              </nav>
           </div>
           <div className="side-menu-backdrop" onClick={() => setShowMenu(false)}></div>
        </div>
      )}

      {/* ================= MODALES ================= */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default Navbar;