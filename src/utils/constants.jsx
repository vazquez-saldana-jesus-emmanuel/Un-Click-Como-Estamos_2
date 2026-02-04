
export const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("⚠️ ¡Falta la variable de entorno VITE_API_URL!");
}