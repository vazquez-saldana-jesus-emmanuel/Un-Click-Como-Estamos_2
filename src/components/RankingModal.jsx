import React from 'react';
import { X } from 'lucide-react';

const RankingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Generamos los datos aquí o los recibimos por props
  const todosLosUsuarios = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    nombre: i < 10 ? [
      "Carlos Rodriguez", "Ana López", "Miguel Ángel Torres", "Lucía Fernández", "Roberto Gómez", 
      "Diana Morales", "Javier Hernández", "Patricia Silva", "Fernando Ruíz", "Elena Castro"
    ][i] : `Ciudadano ${i + 1}`,
    reportes: i < 10 ? [154, 142, 128, 115, 98, 92, 87, 85, 79, 74][i] : Math.floor(Math.random() * 70) + 10,
    zona: ["Centro", "Norte", "Sur", "Oeste", "Industrial"][Math.floor(Math.random() * 5)],
    estado: i % 3 === 0 ? "Nuevo" : "Verificado"
  })).sort((a, b) => b.reportes - a.reportes);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div>
            <h2>Ranking Global de Ciudadanos</h2>
            <p>Listado completo de usuarios con mayor participación</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <table className="users-table full-width">
            <thead>
               <tr>
                 <th style={{position:'sticky', top:0, background:'white', zIndex: 10}}>#</th>
                 <th style={{position:'sticky', top:0, background:'white', zIndex: 10}}>Usuario</th>
                 <th style={{position:'sticky', top:0, background:'white', zIndex: 10}}>Total Reportes</th>
                 <th style={{position:'sticky', top:0, background:'white', zIndex: 10}}>Zona</th>
                 <th style={{position:'sticky', top:0, background:'white', zIndex: 10}}>Estado</th>
               </tr>
            </thead>
            <tbody>
               {todosLosUsuarios.map((usuario, index) => (
                 <tr key={usuario.id} className={index < 3 ? 'top-rank-modal' : ''}>
                    <td style={{textAlign:'center'}}>
                       {index + 1}
                    </td>
                    <td style={{fontWeight: '600', color:'#1e293b'}}>{usuario.nombre}</td>
                    <td>
                      <div className="report-count" style={{justifyContent: 'center'}}>
                        {usuario.reportes}
                      </div>
                    </td>
                    <td>{usuario.zona}</td>
                    <td>
                       <span className={`status-badge ${usuario.estado === 'Verificado' ? 'verified' : 'new'}`}>
                         {usuario.estado}
                       </span>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <p>{todosLosUsuarios.length} usuarios encontrados</p>
          <button className="btn-primary-modal" onClick={onClose}>Cerrar</button>
        </div>

      </div>
    </div>
  );
};

export default RankingModal;