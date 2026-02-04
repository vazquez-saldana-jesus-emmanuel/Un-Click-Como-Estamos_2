import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css"; 

import Login from "./components/login.jsx";
import Reportes from "./components/Reportes";
import Home from "./components/Home.jsx";
import Dashboard from "./components/Dashboard.jsx";
import DirectorioEmpleados from "./components/DirectorioEmpleados"; 
import PConfiguracion from "./components/PConfiguracion.jsx";

export default function App() {
  return (
    <Router>
      {/* ¡YA NO HAY IMAGEN AQUÍ! La controlaremos desde CSS */}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/empleados" element={<DirectorioEmpleados />} />
        <Route path="/configuracion" element={<PConfiguracion />} />
      </Routes>
    </Router>
  );
}