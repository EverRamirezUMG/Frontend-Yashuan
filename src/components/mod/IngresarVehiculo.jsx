import React, { useState, useEffect } from "react";
import styled from "styled-components";
import swal from "sweetalert2";
import "./styles/IngresarMuestra.css";
import { useForm } from "react-hook-form";
import LogCatacion from "../../assets/nuevo-cliente.png";

const IngresarVehiculo = ({
  children,
  estado,
  cambiarEstado,
  idpartida,
  titulo,
}) => {
  const token = localStorage.getItem("token");
  const URL = import.meta.env.VITE_URL;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await fetch(`${URL}vehiculos/ingresar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        cambiarEstado(false);
        const errorData = await response.json();
        throw new Error(errorData.message || "Error desconocido");
      }

      cambiarEstado(false);
      swal.fire({
        title: "Datos ingresados!",
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
    } catch (error) {
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
    }
  });

  useEffect(() => {
    if (estado === false) {
      reset();
    }
  }, [estado]);

  return (
    <>
      {estado && (
        <Overlay>
          <ContenedorModal>
            <EncabezadoModal>
              <div className="encabezado-ingresar-muestra">
                <h2>{titulo}</h2>
              </div>
            </EncabezadoModal>
            <BotonCerrar onClick={() => cambiarEstado(false)}>
              <span className="material-symbols-outlined">close</span>
            </BotonCerrar>
            <div className="contenedor-ingresar-muestra">
              <form
                className="muestra-form"
                id="FormularioP"
                onSubmit={onSubmit}
              >
                <div className="itemProv">
                  <div className="entrada">
                    <input
                      {...register("marca", {
                        required: "Este campo es requerido",
                      })}
                      type="text"
                      id="marca"
                      placeholder="Marca del vehiculo"
                    />
                  </div>
                </div>

                <div className="itemProv">
                  <div className="entrada">
                    <input
                      {...register("color", {
                        required: "Este campo es requerido",
                      })}
                      type="text"
                      id="color"
                      placeholder="Color del vehiculo"
                    ></input>
                  </div>
                  {errors.color && (
                    <p className="error-message">{errors.color.message}</p>
                  )}
                </div>
                <div className="itemProv">
                  <div className="entrada">
                    <input
                      {...register("alias")}
                      type="text"
                      id="alias"
                      placeholder="Alias del vehiculo"
                    ></input>
                  </div>
                </div>

                <div className="itemProv">
                  <div className="entrada">
                    <input
                      {...register("placa", {
                        required: "Este campo es requerido",
                        pattern: {
                          value: /^[PCM]-\d{3}[A-Z]{3}$/,
                          message: "Formato de placa inválido",
                        },
                      })}
                      type="text"
                      id="placa"
                      placeholder="Numero de placa"
                    ></input>
                  </div>
                  {errors.placa && (
                    <p className="error-message">{errors.placa.message}</p>
                  )}
                </div>

                <div className="bonotesNewProv">
                  <div>
                    <button
                      type="button"
                      onClick={() => cambiarEstado(false)}
                      className="btcancelari"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div>
                    <button type="submit" className="btGuardari">
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

export default IngresarVehiculo;

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
  width: 500px;
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
