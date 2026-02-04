import { useState, useEffect } from 'react';
import { getCurrentUser } from "./auth"; 
// IMPORTANTE: Ya borramos la línea que importaba la base de datos

export function useUserData() {
  // 1. Inicializamos leyendo la memoria del navegador
  const [user, setUser] = useState(() => {
    const session = getCurrentUser() || {};
    return formateaUsuario(session);
  });

  // Función auxiliar para asegurar que siempre tengamos datos visuales
  function formateaUsuario(data) {
    const nombreDisplay = data.nombre || data.name || data.username || "Usuario";
    return {
      ...data,
      nombre: nombreDisplay,
      email: data.email || "",
      // Si la API no trae foto, generamos una con sus iniciales automáticamente
      avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreDisplay)}&background=random&color=fff`,
      role: data.role || "USER"
    };
  }

  // 2. Función para refrescar datos (Lee de LocalStorage, ya NO de la BD)
  const refreshUser = () => {
    const session = getCurrentUser();
    if (session) {
      setUser(formateaUsuario(session));
    }
  };

  // 3. Listener: Atento a si alguien inicia sesión o cierra sesión
  useEffect(() => {
    refreshUser();

    const handleStorageChange = () => refreshUser();
    window.addEventListener("storage", handleStorageChange);
    
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { user, refreshUser };
}