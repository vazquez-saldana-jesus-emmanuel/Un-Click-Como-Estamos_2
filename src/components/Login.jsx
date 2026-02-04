import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// 1. IMPORTAMOS LA CONSTANTE (Asegúrate que la ruta sea correcta)
import { API_URL } from "../utils/constants";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setMessage("");
    setLoading(true);

    try {
      // 2. USAMOS LA CONSTANTE AQUÍ
      // Ya no escribimos la URL completa, solo la variable + el endpoint
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: username, 
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); 
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        window.dispatchEvent(new Event("storage"));

        navigate("/home");
      } else {
        setMessage(`❌ ${data.message || "Credenciales incorrectas"}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setMessage("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <main className="card">
        
        <h1 className="title">Bienvenido de nuevo</h1>
        <p className="subtitle">Inicia sesión en tu cuenta</p>
        
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <div className="field">
            <label>Usuario / Correo</label>
            <div className="input-wrap">
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="ej. admin@eucce.com" 
              />
            </div>
          </div>
          <div className="field">
            <label>Contraseña</label>
            <div className="input-wrap password-wrap">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <span className="eye" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>
          
          <button 
            className="btn" 
            onClick={handleLogin} 
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
          
          {message && <p style={{textAlign:"center", color:"red", marginTop:"10px", fontSize: "13px"}}>{message}</p>}
        </form>
      </main>
    </div>
  );
}