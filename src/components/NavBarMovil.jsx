import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import logo from "../assets/logo.png";
// import "./Styles/NavBar-escritorio.css";
import "./Styles/NavBarMovil.css";

export const NavBarMovil = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = (route) => {
    navigate(route); // Navega a la ruta correspondiente
  };
  return (
    <>
      <nav className="NavBarM">
        <div className="menuM">
          <button
            type="button"
            className={`navM ${
              location.pathname === "/Admin/Inicio" ? "active" : ""
            }`} // Clase "active" si la ruta coincide
            onClick={() => handleButtonClick("/Admin/Inicio")}
          >
            <div className="ReportesM">
              <span className="material-symbols-outlined">area_chart</span>
              <span> Analisis</span>
            </div>
          </button>

          <button
            type="button"
            className={`navM ${
              location.pathname === "/Admin/Acopio" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("/Admin/Acopio")}
          >
            <div className="ReportesM">
              <span className="material-symbols-outlined">balance</span>
              <span> Acopio </span>
            </div>
          </button>

          <button
            type="button"
            className={`navM ${
              location.pathname === "/Admin/Inventario" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("/Admin/Inventario")}
          >
            <div className="ReportesM">
              <span className="material-symbols-outlined">deployed_code</span>
              <span> Inventario</span>
            </div>
          </button>

          <button
            type="button"
            className={`navM ${
              location.pathname === "/Admin/Ventas" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("/Admin/Ventas")}
          >
            <div className="ReportesM">
              <span className="material-symbols-outlined">local_cafe</span>
              <span> Ventas</span>
            </div>
          </button>

          {/* <button
            type="button"
            className={`navM ${
              location.pathname === "/Admin/Costo" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("/Admin/Costo")}
          >
            <div className="ReportesM">
              <span className="material-symbols-outlined">manufacturing</span>
              <span> Costo de producción</span>
            </div>
          </button> */}

          <button
            type="button"
            className={`navM ${
              location.pathname === "/Admin/Usuario" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("/Admin/Usuario")}
          >
            <div className="ReportesM">
              <span className="material-symbols-outlined">manage_accounts</span>
              <span> Usuarios</span>
            </div>
          </button>
        </div>
      </nav>
    </>
  );
};
