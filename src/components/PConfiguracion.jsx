import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; 
import './PConfiguracion.css';
import { updateUserData } from "../utils/auth"; 
import { useUserData } from "../utils/useUserData"; 
// 1. IMPORTAMOS EL UPLOADER
import ProfileImageUploader from "./ProfileImageUploader";

import { 
  User, Shield, Bell, Mail, Users,
  Loader2, CheckCircle, AlertCircle
} from 'lucide-react';

const PConfiguracion = () => {
  const { user, refreshUser } = useUserData();
  const isSuperAdmin = user?.username === 'admin';

  // 2. ESTADO DEL FORMULARIO (Agregamos 'avatar' aquí)
  const [perfil, setPerfil] = useState({
    nombre: '',
    email: '',
    avatar: null // Guardará la nueva foto temporalmente
  });

  // SINCRONIZACIÓN AUTOMÁTICA
  useEffect(() => {
    setPerfil({
      nombre: user.nombre || user.name || user.username || "", 
      email: user.email || "",
      avatar: user.avatar || null // Cargamos la foto actual
    });
  }, [user]);

  // Estados de UI
  const [security, setSecurity] = useState({ current: '', newPass: '', confirmPass: '' });
  const [alertas, setAlertas] = useState({ reportes: true, personal: false });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
  const [activeSection, setActiveSection] = useState('perfil');

  // --- FUNCIONES ---

  const showNotification = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  // 3. FUNCIÓN QUE RECIBE LA IMAGEN DEL UPLOADER
  const handleImageUpload = (base64Image) => {
    // Actualizamos el estado local para ver la previsualización al instante
    setPerfil(prev => ({ ...prev, avatar: base64Image }));
  };

  const handleSaveProfile = async () => {
    if (!perfil.nombre || !perfil.email) {
       showNotification('Completa nombre y correo', 'error');
       return;
    }
    setLoading(true);
    
    // Al guardar, enviamos todo el objeto perfil (incluyendo la nueva foto si cambió)
    await updateUserData({ ...user, ...perfil });
    await refreshUser(); 
    
    setLoading(false);
    showNotification('Perfil actualizado correctamente.');
  };

  const handleUpdatePassword = () => {
    if (!security.current || !security.newPass || !security.confirmPass) {
      showNotification('Completa todos los campos.', 'error'); return;
    }
    if (security.newPass !== security.confirmPass) {
      showNotification('Las contraseñas no coinciden.', 'error'); return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSecurity({ current: '', newPass: '', confirmPass: '' });
      showNotification('Contraseña actualizada.');
    }, 1500);
  };

  const toggleAlert = (key) => setAlertas(prev => ({ ...prev, [key]: !prev[key] }));
  
  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="pc-page-wrapper">
      <Navbar />

      <div className={`pc-toast ${toast.show ? 'show' : ''} ${toast.type}`}>
        {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        <span>{toast.msg}</span>
      </div>

      <div className="pc-container">
        
        <aside className="pc-sidebar">
          <div className="pc-sidebar-header"><h2>Configuración</h2></div>
          <nav className="pc-nav">
            <button className={`pc-nav-item ${activeSection === 'perfil' ? 'active' : ''}`} onClick={() => scrollToSection('perfil')}>
              <User size={18} className="pc-icon" /> Perfil
            </button>
            <button className={`pc-nav-item ${activeSection === 'seguridad' ? 'active' : ''}`} onClick={() => scrollToSection('seguridad')}>
              <Shield size={18} className="pc-icon" /> Seguridad
            </button>
            <button className={`pc-nav-item ${activeSection === 'notificaciones' ? 'active' : ''}`} onClick={() => scrollToSection('notificaciones')}>
              <Bell size={18} className="pc-icon" /> Notificaciones
            </button>
          </nav>
        </aside>

        <main className="pc-main">
          
          {/* 1. PERFIL */}
          <div id="perfil" className="pc-card">
            <div className="pc-card-header">
              <h3>Información Personal</h3>
              <p>Actualiza tus datos básicos.</p>
            </div>
            <div className="pc-card-body">
              <div className="pc-avatar-section">
                <div className="pc-avatar">
                  {/* Usamos perfil.avatar para la preview inmediata */}
                  {perfil.avatar ? (
                    <img src={perfil.avatar} alt="Avatar" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%'}} />
                  ) : (
                    <span style={{fontSize:'24px', fontWeight:'bold', color:'#64748b'}}>
                        {perfil.nombre?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                
                {/* 4. AQUÍ USAMOS EL COMPONENTE UPLOADER */}
                <ProfileImageUploader 
                  onUpload={handleImageUpload} 
                  className="pc-btn pc-btn-light" 
                />

              </div>
              <div className="pc-form-row">
                <div className="pc-form-group">
                  <label>Nombre Completo</label>
                  <input 
                    type="text" 
                    value={perfil.nombre} 
                    onChange={(e) => setPerfil({...perfil, nombre: e.target.value})}
                    placeholder="Cargando nombre..."
                  />
                </div>
                <div className="pc-form-group">
                  <label>Correo Electrónico</label>
                  <input 
                    type="email" 
                    value={perfil.email} 
                    onChange={(e) => setPerfil({...perfil, email: e.target.value})}
                    placeholder="Cargando correo..."
                  />
                </div>
              </div>
              <div className="pc-action-right">
                <button className="pc-btn pc-btn-primary" onClick={handleSaveProfile} disabled={loading}>
                  {loading ? <span className="flex-center"><Loader2 className="animate-spin mr-2" size={16}/> Guardando...</span> : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>

          {/* 2. SEGURIDAD */}
          <div id="seguridad" className="pc-card">
            <div className="pc-card-header">
              <h3>Seguridad</h3>
              <p>Cambia tu contraseña de acceso.</p>
            </div>
            <div className="pc-card-body">
              <div className="pc-form-row three-cols">
                <div className="pc-form-group">
                  <label>Actual</label>
                  <input type="password" value={security.current} onChange={(e) => setSecurity({...security, current: e.target.value})} />
                </div>
                <div className="pc-form-group">
                  <label>Nueva</label>
                  <input type="password" value={security.newPass} onChange={(e) => setSecurity({...security, newPass: e.target.value})} />
                </div>
                <div className="pc-form-group">
                  <label>Confirmar</label>
                  <input type="password" value={security.confirmPass} onChange={(e) => setSecurity({...security, confirmPass: e.target.value})} />
                </div>
              </div>
              <div className="pc-action-right">
                <button className="pc-btn pc-btn-dark" onClick={handleUpdatePassword} disabled={loading}>
                  {loading ? 'Procesando...' : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>

          {/* 3. NOTIFICACIONES */}
          <div id="notificaciones" className="pc-card">
            <div className="pc-card-header">
              <h3>Notificaciones</h3>
              <p>Configura tus alertas por correo.</p>
            </div>
            <div className="pc-card-body">
              <div className="pc-alert-item">
                <div className="pc-alert-info">
                  <div className="pc-alert-icon blue-bg"><Mail size={20} /></div>
                  <div><h4>Nuevos reportes</h4><p>Recibir email al crear reporte.</p></div>
                </div>
                <div className={`pc-toggle ${alertas.reportes ? 'on' : 'off'}`} onClick={() => toggleAlert('reportes')}>
                  <div className="pc-toggle-circle"></div>
                </div>
              </div>
              {isSuperAdmin && (
                <div className="pc-alert-item">
                  <div className="pc-alert-info">
                    <div className="pc-alert-icon gray-bg"><Users size={20} /></div>
                    <div><h4>Cambios de personal</h4><p>Notificar altas y bajas.</p></div>
                  </div>
                  <div className={`pc-toggle ${alertas.personal ? 'on' : 'off'}`} onClick={() => toggleAlert('personal')}>
                    <div className="pc-toggle-circle"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default PConfiguracion;