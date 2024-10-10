import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../styles/Registrarse.css";
import Swal from "sweetalert2";

export const Registrarse = () => {
  const URL = import.meta.env.VITE_URL;

  const [estadoModal1, cambiarEstadoModal1] = useState(false);

  const navigate = useNavigate();

  //------- crear un nuevo registro de usuario ----------------
  const { handleSubmit, register } = useForm();
  const enviarUsuario = handleSubmit((data) => {
    console.log(data);
    fetch(URL + "register", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    cambiarEstadoModal1(!estadoModal1);
    Swal.fire({
      title: "Usuario Agregado!",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        confirmButton: "btEliminar",
        cancelButton: "btCancelar",
        popup: "popus-eliminado",
        title: "titulo-pop",
        container: "contenedor-alert",
      },
    });
    navigate("/Admin");
  });
  return (
    <>
      <div className="BodydiveR">
        <div>
          <form className="nuevoR" id="FormularioP" onSubmit={enviarUsuario}>
            <h1>Registro</h1>
            <div className="itemProv">
              <label>Nombre: </label>
              <input
                {...register("nombre")}
                type="text"
                id="nombre"
                placeholder="Nombre"
              ></input>
            </div>

            <div className="itemProv">
              <label>Apellido: </label>
              <input
                {...register("apellido")}
                type="text"
                id="apellido"
                placeholder="Apellido"
              ></input>
            </div>

            <div className="itemProv">
              <label>Alias: </label>
              <input
                {...register("alias")}
                type="text"
                id="alias"
                placeholder="Alias"
              ></input>
            </div>

            <div className="itemProv">
              <label>Correo: </label>
              <input
                {...register("email")}
                type="text"
                id="email"
                placeholder="Correo electronico"
              ></input>
            </div>

            <div className="itemProv">
              <label>Contraseña: </label>
              <input
                {...register("password")}
                type="text"
                id="password"
                placeholder="Contraseña"
              ></input>
            </div>
            <br />

            <div className="botones">
              <div>
                <button type="submit" className="btRegistrar">
                  Registrarse
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => navigate("/Admin")}
                  className="btcancelar"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
