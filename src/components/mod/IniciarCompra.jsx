import React from "react";
import styled from "styled-components";
import swal from "sweetalert2";
import "./styles/IniciarCompra.css";
import { useForm } from "react-hook-form";

export const IniciarCompra = ({ children, estado, cambiarEstado, titulo }) => {
  const token = localStorage.getItem("token");
  const codigo = localStorage.getItem("codigo");
  const URL = import.meta.env.VITE_URL;
  const { handleSubmit, register } = useForm();

  const onSubmit = handleSubmit((data) => {
    fetch(`${URL}acopio/iniciar/${codigo}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Error desconocido");
            cambiarEstado(false);
          });
        }
        return response.json();
      })
      .then(() => {
        cambiarEstado(false);
        swal.fire({
          title: "Compra Iniciada!",
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
      })
      .catch((error) => {
        swal.fire({
          title: "Error",
          text: error.message,
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
      });
  });

  return (
    <>
      {estado && (
        <Overlay>
          <ContenedorModal>
            <EncabezadoModal>
              <h2>{titulo}</h2>
            </EncabezadoModal>
            <BotonCerrar onClick={() => cambiarEstado(false)}>
              <span className="material-symbols-outlined">close</span>
            </BotonCerrar>
            <div className="containerNewProv">
              <form
                className="nuevoProvForm"
                id="FormularioP"
                onSubmit={onSubmit}
              >
                <div className="datos">
                  <div className="gropu">
                    <div className="itemProv">
                      <label>Partida: </label>
                      <input
                        {...register("partida")}
                        type="number"
                        step="0.01"
                        id="partida"
                        placeholder="Numero de partida"
                      ></input>
                    </div>

                    <div className="itemProv">
                      <label>Precio base: </label>
                      <input
                        {...register("base")}
                        type="number"
                        step="0.01"
                        id="base"
                        placeholder="Precio base"
                      ></input>
                    </div>

                    <div className="itemProv">
                      <label>Socio: </label>
                      <input
                        {...register("socio")}
                        type="number"
                        step="0.01"
                        id="socio"
                        placeholder="Socio"
                      ></input>
                    </div>
                  </div>
                  <div className="gropu">
                    <div className="itemProv">
                      <label>Recolector: </label>
                      <input
                        {...register("recolector")}
                        type="number"
                        step="0.01"
                        id="recolector"
                        placeholder="Recolector"
                      ></input>
                    </div>
                    <div className="itemProv">
                      <label>Especial: </label>
                      <input
                        {...register("especial")}
                        type="number"
                        step="0.01"
                        id="especial"
                        placeholder="Especial"
                      ></input>
                    </div>

                    <div className="itemProv">
                      <label>Flete: </label>
                      <input
                        {...register("flete")}
                        type="number"
                        step="0.01"
                        id="flete"
                        placeholder="Flete"
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="bonotesNewProv">
                  <div>
                    <button
                      type="button"
                      onClick={() => cambiarEstado(false)}
                      className="btcancelar"
                    >
                      Cancelar
                    </button>
                  </div>
                  <div>
                    <button type="submit" className="btGuardar">
                      Guardar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </ContenedorModal>
        </Overlay>
      )}
    </>
  );
};

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
  width: 450px;
  min-height: 100px;
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
