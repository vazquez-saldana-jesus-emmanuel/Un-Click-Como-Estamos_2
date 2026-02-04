import React, { useState, useEffect, useRef } from "react";
import { X, Camera, Check } from "lucide-react"; // 1. Importamos Check
import "./ProfileModal.css";
import { updateUserData } from "../utils/auth";
import { useUserData } from "../utils/useUserData";

export default function ProfileModal({ onClose }) {
  const fileInputRef = useRef(null);
  const { user, refreshUser } = useUserData();
  
  // Estado local para el formulario
  const [formData, setFormData] = useState({
    nombre: "", 
    username: "", 
    email: "", 
    avatar: null
  });

  // 2. NUEVO ESTADO: Para controlar la vista de éxito
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      nombre: user.nombre || "",
      username: user.username || "",
      email: user.email || "",
      avatar: user.avatar || null
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFormData(prev => ({...prev, avatar: reader.result}));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Guardamos datos
    await updateUserData({ ...user, ...formData });
    await refreshUser(); 

    // 3. CAMBIO: En vez de alert(), mostramos la vista bonita
    setShowSuccess(true);

    // Cerramos el modal automáticamente después de 1.5 segundos
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card animated-fade-in">
        
        {/* 4. BLOQUE DE ÉXITO (Se muestra solo si showSuccess es true) */}
        {showSuccess && (
          <div className="success-message-overlay">
            <div className="success-icon-circle">
              <Check size={32} color="#15803d" strokeWidth={3} />
            </div>
            <h3 className="success-title">¡Actualizado!</h3>
            <p className="success-text">Tus datos se guardaron correctamente.</p>
          </div>
        )}

        <button className="close-btn-top" onClick={onClose}><X size={20}/></button>
        <div className="modal-header"><h2>Perfil de Usuario</h2></div>

        <form onSubmit={handleSubmit} className="modal-form">
          
          {/* SECCIÓN AVATAR */}
          <div className="avatar-section">
            <div className="avatar-wrapper">
              {formData.avatar ? (
                <img src={formData.avatar} alt="avatar" className="avatar-img" />
              ) : (
                <div className="avatar-placeholder">
                  {formData.nombre?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <button type="button" className="camera-btn" onClick={() => fileInputRef.current.click()}>
                <Camera size={16}/>
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{display:'none'}}/>
          </div>

          {/* NOMBRE COMPLETO */}
          <div className="input-group">
            <label>Nombre Completo</label>
            <div className="input-wrapper">
              <input 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* CORREO */}
          <div className="input-group">
            <label>Correo electrónico</label>
            <div className="input-wrapper">
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* USUARIO (SOLO LECTURA) */}
          <div className="input-group" style={{opacity: 0.7}}>
             <label>Usuario (Login)</label>
             <div className="input-wrapper">
               <input 
                 type="text" 
                 value={formData.username} 
                 disabled 
                 style={{background: '#f3f4f6'}}
               />
             </div>
          </div>

          {/* BOTONES */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}