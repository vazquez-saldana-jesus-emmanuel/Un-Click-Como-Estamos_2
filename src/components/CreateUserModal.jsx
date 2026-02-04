import React, { useState } from 'react';
import { X, Check, Eye, Briefcase, Shield, AlertCircle } from 'lucide-react'; 
import './CreateUserModal.css';

const CreateUserModal = ({ onClose, onCreateUser }) => {
  // Eliminamos el campo 'username' del estado inicial
  const [formData, setFormData] = useState({
    nombre: '', email: '', celular: '',
    password: '', confirmPassword: '',
    role: 'empleado'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
    // Eliminamos la lógica de autogenerar usuario
  };

  const setRole = (role) => setFormData(prev => ({ ...prev, role }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    // Validación sin username
    if (!formData.nombre || !formData.password) {
      setErrorMessage("Por favor completa los campos obligatorios (*)");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    const resultado = await onCreateUser(formData);

    if (resultado && resultado.success) {
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setErrorMessage(resultado?.message || "Ocurrió un error al guardar.");
    }
  };

  const successMessage = formData.role === 'admin' ? "¡Administrador creado exitosamente!" : "¡Empleado creado exitosamente!";

  return (
    <div className="modal-overlay">
      <div className="create-modal-modern" style={{ position: 'relative' }}>
        
        {showSuccess && (
          <div className="success-overlay">
            <div className="success-icon-box"><Check size={40} strokeWidth={3} /></div>
            <h3>¡Listo!</h3><p>{successMessage}</p>
          </div>
        )}

        <div className="modal-header">
          <div><h2>Crear Nuevo Usuario</h2><p>Registra un nuevo miembro del equipo.</p></div>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modern-form">
          
          {errorMessage && (
            <div className="error-banner">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="form-row">
            <div className="form-group" style={{flex: 2}}>
              <label>Nombre Completo *</label>
              <div className={`input-wrapper no-icon ${errorMessage && !formData.nombre ? 'input-error' : ''}`}>
                <input type="text" name="nombre" placeholder="Ej. Victor Azael Meraz Vazquez" value={formData.nombre} onChange={handleChange} required />
              </div>
            </div>
            {/* Campo Usuario ELIMINADO */}
          </div>

          <div className="form-row">
            <div className="form-group"><label>Correo Electrónico</label><div className="input-wrapper no-icon"><input type="email" name="email" placeholder="correo@empresa.com" value={formData.email} onChange={handleChange} /></div></div>
            <div className="form-group"><label>Celular</label><div className="input-wrapper no-icon"><input type="tel" name="celular" placeholder="55 1234 5678" value={formData.celular} onChange={handleChange} /></div></div>
          </div>

          <div className="form-group">
            <label>Rol de Usuario</label>
            <div className="role-selector">
              <div className={`role-card ${formData.role === 'empleado' ? 'selected' : ''}`} onClick={() => setRole('empleado')}>
                <div className="role-icon-box blue"><Briefcase size={20} /></div>
                <div className="role-info"><span>Empleado</span><small>Acceso estándar</small></div>
                {formData.role === 'empleado' && <Check size={18} className="check-icon" />}
              </div>
              
              <div className={`role-card ${formData.role === 'admin' ? 'selected' : ''}`} onClick={() => setRole('admin')}>
                <div className="role-icon-box cyan"><Shield size={20} /></div>
                <div className="role-info"><span>Administrador</span><small>Acceso total</small></div>
                {formData.role === 'admin' && <Check size={18} className="check-icon" />}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group"><label>Contraseña *</label><div className="input-wrapper no-icon"><input type={showPassword ? "text" : "password"} name="password" placeholder="••••••" value={formData.password} onChange={handleChange} required style={{ paddingRight: '40px' }} /><button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}><Eye size={18} /></button></div></div>
            <div className="form-group"><label>Confirmar *</label><div className="input-wrapper no-icon"><input type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="••••••" value={formData.confirmPassword} onChange={handleChange} required style={{ paddingRight: '40px' }} /><button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}><Eye size={18} /></button></div></div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">Guardar Usuario</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateUserModal;