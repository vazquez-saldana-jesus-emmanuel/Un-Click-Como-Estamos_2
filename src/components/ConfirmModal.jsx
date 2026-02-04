import React from "react";
import { CheckCircle, HelpCircle, AlertTriangle } from "lucide-react";
import "./Reportes.css"; // Usa los mismos estilos

export default function ConfirmModal({ isOpen, type, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <div className={`confirm-icon ${type}`}>
          {type === 'info' && <HelpCircle size={32}/>}
          {type === 'success' && <CheckCircle size={32}/>}
          {type === 'danger' && <AlertTriangle size={32}/>}
        </div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-desc">{message}</p>
        <div className="confirm-actions">
          <button className="btn-confirm-cancel" onClick={onCancel}>Cancelar</button>
          <button className={`btn-confirm-accept ${type}`} onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}