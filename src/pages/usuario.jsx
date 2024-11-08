import React, { useEffect, useState, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import NavBar from "../components/NavBarDesk";
import Encabezado from "../components/Encabezado";
import { Navigate } from "react-router-dom";
import swal from "sweetalert2";
import "../styles/Usuario.css";
import CrearUser from "../components/mod/CrearUsuario";
import UpdateUsuario from "../components/mod/UpdateUsuario";
import avatar from "../../public/IMG/AVATAR/avatar2.png";
import Permisos from "../components/mod/Permisos";

const Usuario = () => {
  const [estadoModal1, cambiarEstadoModal1] = useState(false);
  const [estadoModal2, cambiarEstadoModal2] = useState(false);
  const [estadoModal3, cambiarEstadoModal3] = useState(false);
  const [idEdit, setIdEdit] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const token = localStorage.getItem("token");
  const permiso = localStorage.getItem("usuarios");
  const URL = import.meta.env.VITE_URL;

  const { reset } = useForm();
  const imageInputRef = useRef(null); // Reference for image input

  if (!token) {
    return <Navigate to="/Admin" />;
  }

  if (permiso === "false") {
    swal.fire({
      title: "¡No tienes permiso a este modulo!",
      icon: "error",
      showConfirmButton: true,
      customClass: {
        confirmButton: "btEliminar",
        cancelButton: "btCancelar",
        popup: "popus-eliminado",
        title: "titulo-pop",
        container: "contenedor-alert",
      },
    });

    return <Navigate to="/Admin/Inicio" />;
  }

  const getUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}usuarios/${true}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const datos = await response.json();
      setUsuarios(datos);
      console.log(datos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (codigo) => {
    setLoading(true);
    try {
      const response = await fetch(URL + `usuario/desactivar/${codigo}`, {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: false }),
      });

      if (response.ok) {
        swal.fire({
          title: "¡Desactivado!",
          icon: "success",
          showConfirmButton: false,
          timer: 1200,
          customClass: {
            confirmButton: "btEliminar",
            cancelButton: "btCancelar",
            popup: "popus-eliminado",
            title: "titulo-pop",
            container: "contenedor-alert",
          },
        });
        getUsuarios();
      } else {
        throw new Error("Error al desactivar el usuario");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const mostrarAlerta = (codigo) => {
    swal
      .fire({
        title: "¿Desea desactivar?",
        icon: "question",
        text: "El usuario será marcado como inactivo.",
        confirmButtonText: "Desactivar",
        confirmButtonColor: "#FF8A00",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#5E5E5E",
        buttonsStyling: false,
        showCloseButton: true,
        customClass: {
          confirmButton: "btEliminar",
          cancelButton: "btCancelar",
          popup: "popus-class",
          title: "titulo-pop",
          text: "text-pop",
          icon: "icon-pop",
          container: "contenedor-alert",
        },
      })
      .then((response) => {
        if (response.isConfirmed) {
          handleDeactivate(codigo);
        }
      });
  };

  const handleActivate = async (codigo) => {
    try {
      const response = await fetch(URL + `usuario/${codigo}`, {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: true }),
      });

      if (response.ok) {
        swal.fire({
          title: "¡Activado!",
          icon: "success",
          showConfirmButton: false,
          timer: 1200,
          customClass: {
            confirmButton: "btEliminar",
            cancelButton: "btCancelar",
            popup: "popus-eliminado",
            title: "titulo-pop",
            container: "contenedor-alert",
          },
        });
        getUsuarios();
      } else {
        throw new Error("Error al Activar el usuario");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const mostrarAlerta2 = (codigo) => {
    swal
      .fire({
        title: "¿Desea Re-activar?",
        icon: "question",
        text: "El usuario será activado nuevamente.",
        confirmButtonText: "Activar",
        confirmButtonColor: "#FF8A00",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#5E5E5E",
        buttonsStyling: false,
        showCloseButton: true,
        customClass: {
          confirmButton: "btEliminar",
          cancelButton: "btCancelar",
          popup: "popus-class",
          title: "titulo-pop",
          text: "text-pop",
          icon: "icon-pop",
          container: "contenedor-alert",
        },
      })
      .then((response) => {
        if (response.isConfirmed) {
          handleActivate(codigo);
        }
      });
  };

  useEffect(() => {
    getUsuarios();
  }, []);

  const currentUsers = useMemo(() => {
    return usuarios;
  }, [usuarios]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = currentUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(currentUsers.length / usersPerPage);

  const handleCloseModal1 = () => {
    cambiarEstadoModal1(!estadoModal1);
    reset(); // Reset form values
    if (imageInputRef.current) {
      imageInputRef.current.value = ""; // Clear image input
    }
  };

  return (
    <>
      <div className="grid-container-U">
        <NavBar />
        <Encabezado titulo="Usuarios" />
        <CrearUser
          estado={estadoModal1}
          cambiarEstado={handleCloseModal1}
          titulo="Crear un nuevo usuario"
          imageInputRef={imageInputRef} // Pass the ref to CrearUser component
        />

        <section className="main-U">
          <div className="busqueda">
            <div className="toggleContainer">
              <h3>Usuarios registrados </h3>
              <div className="ToggleB"></div>
            </div>

            <div className="buscar">
              <input type="text" placeholder="    Bucar usuario" />
              <button className="BTbuscar">
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>

            <div className="agregar">
              <button
                onClick={() => cambiarEstadoModal1(!estadoModal1)}
                className="BTagregar"
              >
                Agregar
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          <UpdateUsuario
            estado2={estadoModal2}
            cambiarEstado2={(estado) => {
              cambiarEstadoModal2(estado);
              if (!estado) getUsuarios();
            }}
            titulo2={"Actualizar Usuario"}
            idEdit={idEdit}
            setUsuarios={setUsuarios}
            usuarios={usuarios}
            imageInputRef={imageInputRef} // Pass the ref to UpdateUsuario component
          ></UpdateUsuario>
          {loading ? (
            <div className="spinner">
              <div className="lds-dual-ring"></div>
            </div>
          ) : (
            <div className="contenedor-usuario">
              <div className="campo-usuario">
                <div className="imgPerfil">
                  <span>
                    <h4>Codigo</h4>
                  </span>
                </div>

                <div className="datos">
                  <div className="nombre">
                    <span>
                      <h4>Nombre</h4>
                    </span>
                  </div>

                  <div className="alias">
                    <span>
                      <h4>Alias</h4>
                    </span>
                  </div>

                  <div className="cargo">
                    <span>
                      <h4>Cargo</h4>
                    </span>
                  </div>

                  <div className="telefono">
                    <span>
                      <h4>Telefono</h4>
                    </span>
                  </div>

                  <div className="email">
                    <span>
                      <h4>Correo</h4>
                    </span>
                  </div>

                  <div className="estado">
                    <span>
                      <h4>Estado</h4>
                    </span>
                  </div>
                </div>

                <div className="botones">
                  <span>
                    <h4>Accion</h4>
                  </span>
                </div>
              </div>
              {paginatedUsers.map((usuario, index) => (
                <div className="dato-usuario" key={index}>
                  <div className="imgPerfil">
                    {usuario.imagenUrl ? (
                      <img src={usuario.imagenUrl} className="avatar" />
                    ) : (
                      <img src={avatar} className="avatar" />
                    )}

                    {/* <img src={avatar} className="avatar" /> */}
                    <span>
                      <h5>{usuario.codigo}</h5>
                    </span>
                  </div>
                  <div className="datos">
                    <div className="nombre">
                      <span>
                        <h4>{usuario.nombre_completo}</h4>
                      </span>
                    </div>
                    <div className="alias">
                      <span>
                        <h4>{usuario.aliaas}</h4>
                      </span>
                    </div>
                    <div className="cargo">
                      <span>
                        <h4>{usuario.cargo}</h4>
                      </span>
                    </div>
                    <div className="telefono">
                      <span>
                        <h4>{usuario.telefono}</h4>
                      </span>
                    </div>
                    <div className="email">
                      <span>
                        <h4>{usuario.email}</h4>
                      </span>
                    </div>
                    <div className="estado">
                      {usuario.superusuario ? (
                        <span>SU</span>
                      ) : (
                        <h4>{usuario.activo ? "Activo" : "Inactivo"}</h4>
                      )}
                    </div>
                  </div>

                  <div className="botones">
                    <Permisos
                      estado3={estadoModal3}
                      cambiarEstado3={cambiarEstadoModal3}
                      titulo2={"Permisos de usuario"}
                      idEdit={idEdit}
                    />
                    {usuario.superusuario ? (
                      "No se puede realizar ninguna accion"
                    ) : usuario.activo ? (
                      <div className="botones">
                        <button
                          className="key"
                          onClick={() =>
                            cambiarEstadoModal3(!estadoModal3) &
                            setIdEdit(usuario.codigo)
                          }
                        >
                          <span className="material-symbols-outlined">
                            vpn_key
                          </span>
                        </button>
                        <button
                          className="btEditarU"
                          onClick={() =>
                            cambiarEstadoModal2(!estadoModal2) &
                            setIdEdit(usuario.codigo)
                          }
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>
                        <button
                          className="btEliminarU"
                          onClick={() => mostrarAlerta(usuario.codigo)}
                          alt="Desactivar usuario"
                        >
                          <span className="material-symbols-outlined">
                            person
                          </span>
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btActivarU"
                        onClick={() => mostrarAlerta2(usuario.codigo)}
                        alt="Activar usuario"
                      >
                        <span className="material-symbols-outlined">
                          person_off
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="paginacion">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Usuario;
