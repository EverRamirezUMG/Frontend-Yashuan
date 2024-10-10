import React, { useEffect, useState } from "react";
import styled from "styled-components";
import swal from "sweetalert2";
import "./styles/UpdateUsuario.css";

const UpdateUsuario = ({
  children,
  estado2,
  cambiarEstado2,
  titulo2,
  idEdit,
  setUsuarios,
  usuarios,
}) => {
  const [usuario, setUsuario] = useState({});
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const [usuarioUP, setUsuarioUP] = useState({
    codigo: "",
    nombre: "",
    apellido: "",
    alias: "",
    telefono: "",
    foto: "", // Añadido para la URL de la imagen
    cargo: "", // Añadido para el cargo
  });

  useEffect(() => {
    if (idEdit) {
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
          console.log(usuario);
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
      getDataUp(idEdit);
    }
  }, [idEdit, URL, token]);

  const getRoles = async () => {
    try {
      const response = await fetch(`${URL}permiso/roles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setRoles(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRoles();
  }, [URL, token]);

  const onChangeData = (e) => {
    setUsuarioUP({ ...usuarioUP, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}usuario/${idEdit}`, {
        method: "PUT",
        body: JSON.stringify(usuarioUP),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsuarios(
        usuarios.map((usuario) =>
          usuario.codigo === usuarioUP.codigo ? usuarioUP : usuario
        )
      );
      cambiarEstado2(false);

      swal.fire({
        title:
          response.status === 200
            ? "Usuario Actualizado!"
            : "Error al Actualizar!",
        icon: response.status === 200 ? "success" : "error",
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
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {estado2 && (
        <Overlay>
          <ContenedorModal>
            <EncabezadoModal>
              <h3>
                <b>
                  {titulo2}: {idEdit}
                </b>{" "}
              </h3>
              <br />
            </EncabezadoModal>
            <BotonCerrar onClick={() => cambiarEstado2(false)}>
              <span className="material-symbols-outlined">close</span>
            </BotonCerrar>
            {loading ? (
              <div className="spinner">
                <div className="lds-dual-ring"></div>
              </div>
            ) : (
              <div className="ContenedorEditarUsuario">
                <form className="nuevoUserForm" onSubmit={handleSubmit}>
                  <div className="imagen">
                    <img
                      src={usuario.imagenUrl}
                      alt="Foto de perfil"
                      className="fotoPerfil"
                    />
                    <label>
                      {usuario.nombre} {usuario.apellido}
                    </label>
                  </div>
                  {["nombre", "apellido", "alias", "telefono"].map((field) => (
                    <div className="itemUser" key={field}>
                      <label>
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                      </label>
                      <input
                        type={field === "telefono" ? "number" : "text"}
                        id={field}
                        name={field}
                        placeholder={
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        value={usuarioUP[field]}
                        onChange={onChangeData}
                      />
                    </div>
                  ))}
                  <div className="itemUser">
                    <label> Cargo: </label>
                    <select
                      name="cargo"
                      id="cargo"
                      value={usuarioUP.cargo}
                      onChange={onChangeData}
                    >
                      {roles.map((rol) => (
                        <option key={rol.idcargo} value={rol.idcargo}>
                          {rol.cargo}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="bonotesNewUser">
                    <button
                      type="button"
                      onClick={() => cambiarEstado2(false)}
                      className="btcancelar"
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btGuardar">
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            )}
            {children}
          </ContenedorModal>
        </Overlay>
      )}
    </>
  );
};

export default UpdateUsuario;

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
`;

const ContenedorModal = styled.div`
  width: 550px;
  min-height: 600px;
  background: #f5f5f5;
  position: relative;
  border-radius: 15px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 20px;
  z-index: 9999;
`;

const EncabezadoModal = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
  color: #000;
`;

const BotonCerrar = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  cursor: pointer;
  transition: 0.3s ease all;
  border-radius: 2px;
  color: #e8e8e8;
  padding: 2px 0px;

  &:hover {
    background: #ff8a00;
    transition: 0.3s;
  }

  span {
    width: 100%;
    height: 100%;
  }
`;
