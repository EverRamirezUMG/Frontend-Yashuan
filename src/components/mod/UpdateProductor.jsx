import React, { useEffect, useState } from "react";
import styled from "styled-components";
import swal from "sweetalert2";
import "./styles/ActualizarCliente.css";

const UpdateProductor = ({
  children,
  estado2,
  cambiarEstado2,
  titulo2,
  id,
  setClientes,
  clientes,
}) => {
  const [productor, setProductor] = useState({});
  const [tipo, setTipo] = useState([]);
  const [loading, setLoading] = useState(false);
  const URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const [productorUP, setProductorUP] = useState({
    codigo: "",
    nombre: "",
    telefono: "",
  });

  useEffect(() => {
    if (id) {
      const getDataUp = async (codigo) => {
        setLoading(true);
        try {
          const response = await fetch(
            `${URL}productores/productor/${codigo}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const resProductor = await response.json();
          setProductor(resProductor);
          setProductorUP({
            codigo: resProductor.pk_productor,
            nombre: resProductor.nombre,
            telefono: resProductor.telefono,
          });
        } catch (err) {
          console.error(err);
        }
        setLoading(false);
      };
      getDataUp(id);
    }
  }, [id, URL, token]);

  const onChangeData = (e) => {
    const { name, value } = e.target;
    setProductorUP((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}productores/actualizar/${id}`, {
        method: "PUT",
        body: JSON.stringify(productorUP),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        cambiarEstado2(false);
        swal.fire({
          title: "Productor Actualizado!",
          text: data.message || "Cliente actualizado correctamente",
          icon: "success",
          showConfirmButton: false,
          timer: 1200,
          customClass: {
            confirmButton: "btEliminar",
            cancelButton: "btCancelar",
            popup: "popus-eliminado",
            title: "titulo-pop",
            container: "contenedor-alert",
            zIndex: 999999,
          },
        });
      } else {
        throw new Error(data.message || "Error al actualizar");
      }
    } catch (error) {
      console.error(error.message || "Error desconocido");
      swal.fire({
        title: "Error al Actualizar!",
        text: error.message || "Error desconocido",
        icon: "error",
        showConfirmButton: false,
        timer: 1200,
        customClass: {
          confirmButton: "btEliminar",
          cancelButton: "btCancelar",
          popup: "popus-eliminado",
          title: "titulo-pop",
          container: "contenedor-alert",
          zIndex: 999999,
        },
      });
      cambiarEstado2(false);
    }
  };

  return (
    <>
      {estado2 && (
        <Overlay>
          <ContenedorModal>
            <EncabezadoModal>
              <h3>
                <b>{titulo2}</b>
              </h3>
            </EncabezadoModal>
            <BotonCerrar onClick={() => cambiarEstado2(false)}>
              <span className="material-symbols-outlined">close</span>
            </BotonCerrar>
            {loading ? (
              <div className="spinner">
                <div className="lds-dual-ring"></div>
              </div>
            ) : (
              <div className="contenedor-cliente">
                <form className="cliente-from" onSubmit={handleSubmit}>
                  <div className="titulo-comp">
                    <h3>{productor?.nombre}</h3>
                    <p>ID: {productor?.pk_productor}</p>
                  </div>
                  <div className="item-cl">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      placeholder="Nombre"
                      value={productorUP.nombre}
                      onChange={onChangeData}
                    />
                  </div>
                  <div className="item-cl">
                    <label>Teléfono:</label>
                    <input
                      type="text"
                      id="telefono"
                      name="telefono"
                      placeholder="Teléfono"
                      value={productorUP.telefono}
                      onChange={onChangeData}
                    />
                  </div>

                  <div className="botones-comp">
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

export default UpdateProductor;

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
`;

const ContenedorModal = styled.div`
  width: 550px;
  min-height: 350px;
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
  padding: 2px 0;

  &:hover {
    background: #ff8a00;
    transition: 0.3s;
  }

  span {
    width: 100%;
    height: 100%;
  }
`;
