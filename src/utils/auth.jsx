// --- GESTIÓN DE SESIÓN (SOLO LOCALSTORAGE) ---

// 1. Guardar o actualizar datos del usuario en el navegador
export const updateUserData = (updatedUser) => {
  try {
    // Guardamos en el navegador
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    
    // Avisamos a la app que hubo un cambio para que se actualice la foto/nombre en el menú
    window.dispatchEvent(new Event("storage"));
    
    return true;
  } catch (error) {
    console.error("Error al actualizar sesión:", error);
    return false;
  }
};

// 2. Obtener el usuario actual
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    return null;
  }
};

// 3. Obtener el Token (para hacer peticiones a la API)
export const getToken = () => {
  return localStorage.getItem("token");
};

// 4. Cerrar Sesión
export const logoutUser = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");
  window.location.href = "/";
};