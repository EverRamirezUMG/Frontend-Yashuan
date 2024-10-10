import React from "react";
import { Encabezado, NavBar } from "../components";
import { Navigate, useNavigate } from "react-router-dom";
import { NavBarMovil } from "../components/NavBarMovil";
import Log2 from "../assets/warning2.png";
import "../styles/Resumen.css";

function Resumen() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/Admin" />;
  }

  return (
    <>
      <div className="vista-resumen">
        <NavBar />
        <NavBarMovil />
        <Encabezado titulo="Resumen acopio" />
        <div className="container-resumen">
          <section className="main-acopio">
            <div className="contenidoN">
              <img src={Log2} alt="" />
              <h1>Resumen Acopio</h1>
              <h3>No se ha podido encontrar el recurso solicitado</h3>
              <button onClick={() => navigate("/Admin/Inicio")}>
                Volver al inicio
              </button>
            </div>
          </section>
          <section className="main-compras">
            <div>
              <h1>compras </h1>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
export default Resumen;
