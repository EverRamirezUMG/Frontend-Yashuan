import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import avatar from "../../public/IMG/AVATAR/avatar2.png";
import PermisoUsuario from "../auth/Permisos";

function Login() {
  const [email, setEmail] = useState("");
  const [contrasenia, setPassword] = useState("");

  const navigate = useNavigate();

  const URL = import.meta.env.VITE_URL;

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Hacer la petición al backend para obtener los datos del usuario
        const response = await fetch(`${URL}datouser/${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching user data");
        }

        const data = await response.json();
        console.log(data);
        return {
          nombre: data.nombre_completo || "Usuario",
          codigo: data.codigo || null,
          imagen: data.imagenUrl || avatar,
          cargo: data.cargo || "Empleado",
          superusuario: data.superusuario || false,
        }; // Asegúrate de que 'nombre_completo' es el campo correcto
      } catch (error) {
        console.error(error);
        return "Usuario"; // Valor por defecto en caso de error
      }
    }
    return "Usuario"; // Valor por defecto si no hay token
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, contrasenia };

      const response = await fetch(`${URL}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);

        // Obtener el nombre del usuario directamente
        const nombreUsuario = await fetchUserData();

        localStorage.setItem("username", nombreUsuario.nombre); // Guarda el nombre del usuario
        localStorage.setItem("codigo", nombreUsuario.codigo); // Guarda el codigo del usuario
        localStorage.setItem("imagen", nombreUsuario.imagen); // Guarda la foto del usuario del usuario
        localStorage.setItem("cargo", nombreUsuario.cargo); // Guarda el cargo del usuario
        localStorage.setItem("superusuario", nombreUsuario.superusuario); // Guarda si el usuario es superusuario

        PermisoUsuario(); // Llama a la función Permisos con el código de usuario

        // Mostrar el nombre de usuario en el SweetAlert
        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: `${nombreUsuario.nombre}
          `, // Muestra el nombre de usuario
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            icon: "icono-ok",
            text: "texto-ok",
            popup: "popup-ok",
            title: "titulo-ok",
          },
        });
        navigate("/Admin/Inicio");
      } else {
        Swal.fire({
          imageUrl: "/src/assets/warning2.png",
          imageWidth: "auto",
          imageHeight: "300px",
          title: "Oops...",
          text: "¡Correo o contraseña incorrecto!",
          customClass: {
            confirmButton: "ok",
            cancelButton: "btCancelar",
            text: "texto-alerta",
            popup: "popup-alerta",
            title: "titulo-pop",
            container: "contA",
            image: "imagen-centrada",
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="Bodydive">
        <div className="login-box">
          <img src={logo} alt="logo" />

          <h1>Iniciar sesión</h1>
          <br />
          <br />
          <form onSubmit={onSubmitForm}>
            <label htmlFor="email"></label>
            <input
              className="input1"
              placeholder="correo"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <label htmlFor="password"></label>

            <input
              className="input1"
              placeholder="contraseña"
              type="password"
              name="contrasenia"
              value={contrasenia}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <br />
            <br />
            <div className="botones">
              <button
                className="BTenviar"
                id="btn-login"
                type="submit"
                onClick={onSubmitForm}
              >
                Iniciar sesión
              </button>
              <button
                className="registrar"
                id="btn-login"
                type="button" // Cambié a 'button' para que no envíe el formulario
                onClick={() => navigate("/Registrarse")} // Ruta para registrarse
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
