import React from "react";
import { Encabezado, NavBar } from "../components";
import { Navigate, useNavigate } from "react-router-dom";
import { NavBarMovil } from "../components/NavBarMovil";
import Log2 from "../assets/warning2.png";
import "../styles/404.css";

function NotFound() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/Admin" />;
  }

  return (
    <>
      <div className="vista">
        <NavBar />
        <NavBarMovil />
        <Encabezado titulo="Inicio" />
        <div className="grid-container404">
          <section className="main404">
            <div className="contenidoN">
              <img src={Log2} alt="" />
              <h1>404</h1>
              <h3>No se ha podido encontrar el recurso solicitado</h3>
              <button onClick={() => navigate("/Admin/Inicio")}>
                Volver al inicio
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
export default NotFound;
