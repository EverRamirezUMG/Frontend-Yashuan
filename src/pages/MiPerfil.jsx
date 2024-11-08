import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBarDesk";
import Encabezado from "../components/Encabezado";
import { Navigate } from "react-router-dom";
import { NavBarMovil } from "../components/NavBarMovil";
import Log2 from "../assets/warning2.png";
import "../styles/404.css";
import { color } from "chart.js/helpers";

function MiPerfil() {
  const token = localStorage.getItem("token");
  const Superusuario = localStorage.getItem("superusuario");
  const URL = import.meta.env.VITE_URL;
  const [loading, setLoading] = useState(false);
  const codigo = localStorage.getItem("codigo");
  const [usuario, setUsuario] = useState({});
  const [currentDate, setCurrentDate] = useState("");
  const [usuarioUP, setUsuarioUP] = useState({
    codigo: "",
    nombre: "",
    apellido: "",
    alias: "",
    telefono: "",
    foto: "", // Añadido para la URL de la imagen
    cargo: "", // Añadido para el cargo
  });

  if (!token) {
    return <Navigate to="/Admin" />;
  }
  useEffect(() => {
    if (usuario.fecha_creacion) {
      const date = new Date(usuario.fecha_creacion);
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setCurrentDate(date.toLocaleDateString("es-ES", options));
    }
  }, [usuario.fecha_creacion]);

  useEffect(() => {
    if (codigo) {
      const getDataUp = async (codigo) => {
        setLoading(true);
        try {
          const response = await fetch(`${URL}usuario/${codigo}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const usuario = await response.json();
          setUsuario(usuario);

          // setCurrentDate(usuario.fecha_creacion);
          setUsuarioUP({
            foto: usuario.imagenUrL,
            codigo: usuario.codigo,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            alias: usuario.aliaas,
            telefono: usuario.telefono,
            cargo: usuario.fk_cargo,
          });
        } catch (err) {
          console.error(err);
        }
        setLoading(false);
      };
      getDataUp(codigo);
    }
  }, [URL, token]);

  return (
    <>
      <div className="vista">
        <NavBar />
        <NavBarMovil />
        <Encabezado titulo="Mi perfil" />
        <div className="grid-container404">
          <section className="main404">
            <div className="contenidoN">
              <div className="ContenedorEditarUsuario">
                <form className="nuevoUserForm">
                  <div className="imagen">
                    <img
                      src={usuario.imagenUrl}
                      alt="Foto de perfil"
                      className="fotoPerfil"
                    />
                    <br />
                    <br />
                    <br />
                    <h2>
                      {usuario.nombre} {usuario.apellido}
                    </h2>
                    <h4>{usuario.codigo}</h4>
                    <h4 style={{ color: "#FF8A00" }}>
                      {Superusuario === "true" ? "Superusuario" : null}
                    </h4>
                  </div>
                  <div className="itemUser">
                    <label>Codigo:</label>
                    <p>{usuario.codigo}</p>
                  </div>
                  <div className="itemUser">
                    <label>Nombre:</label>
                    <p>{usuario.nombre}</p>
                  </div>
                  <div className="itemUser">
                    <label>Apellido:</label>
                    <p>{usuario.apellido}</p>
                  </div>
                  <div className="itemUser">
                    <label>Alias:</label>
                    <p>{usuario.aliaas}</p>
                  </div>
                  <div className="itemUser">
                    <label>Correo:</label>
                    <p>{usuario.email}</p>
                  </div>
                  <div className="itemUser">
                    <label>Telefono:</label>
                    <p>{usuario.telefono}</p>
                  </div>
                  <div className="itemUser">
                    <label>Cargo:</label>
                    <p>{usuario.cargo}</p>
                  </div>
                  <div className="itemUser">
                    <label>Fecha de creacion:</label>
                    <p>{currentDate}</p>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
export default MiPerfil;
