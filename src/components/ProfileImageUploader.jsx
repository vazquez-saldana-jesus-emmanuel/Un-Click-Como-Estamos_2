import React, { useRef } from "react";

// Aceptamos className para poder estilizar el botón desde fuera
export default function ProfileImageUploader({ onUpload, className }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      onUpload(reader.result); // Devolvemos la imagen en Base64
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <button
        type="button"
        // Si nos pasan una clase la usamos, si no, usa la default "upload-btn"
        className={className || "upload-btn"} 
        onClick={() => fileInputRef.current.click()}
      >
        Cambiar Foto
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}