import React, { useState, useEffect } from "react";
import styled from "styled-components";
import swal from "sweetalert2";
import "./styles/IngresarCatacion.css";
import { useForm } from "react-hook-form";
import LogCatacion from "../../assets/catacion.png";

const IngresarCatacion = ({
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
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await fetch(
        `${URL}rendimiento/ingresarcatacion/${idpartida}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

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
      const form = document.getElementById("FormularioP");
      if (form) {
        form.reset();
      }
    }
  }, [estado]);

  return (
    <>
      {estado && (
        <Overlay>
          <ContenedorModal>
            <EncabezadoModal>
              <div className="encabezado-catacion">
                <img src={LogCatacion} alt="logo" className="icono" />
                <h2>{titulo}</h2>
              </div>
            </EncabezadoModal>
            <BotonCerrar onClick={() => cambiarEstado(false)}>
              <span className="material-symbols-outlined">close</span>
            </BotonCerrar>
            <div className="contenedor-catacion">
              <form
                className="catacion-form"
                id="FormularioP"
                onSubmit={onSubmit}
              >
                <div className="datos-catacion">
                  <div className="gropu">
                    <div className="itemProv">
                      <div className="entrada">
                        <label>Aroma: </label>
                        <input
                          {...register("aroma", {
                            required: "Este campo es requerido",
                            pattern: {
                              value: /^(?!0$)\d+(\.\d{1,2})?$/,
                              message: "El valor no debe ser nulo ni menor a 0",
                            },
                            max: {
                              value: 10,
                              message: "El valor no debe ser mayor a 10",
                            },
                          })}
                          type="number"
                          step="0.01"
                          id="aroma"
                          placeholder="Nota"
                        ></input>
                      </div>
                      {errors.aroma && (
                        <p className="error-message">{errors.aroma.message}</p>
                      )}
                    </div>

                    <div className="itemProv">
                      <div className="entrada">
                        <label>Posgusto: </label>
                        <input
                          {...register("posgusto", {
                            required: "Este campo es requerido",
                            pattern: {
                              value: /^(?!0$)\d+(\.\d{1,2})?$/,
                              message: "El valor no debe ser nulo ni menor a 0",
                            },
                            max: {
                              value: 10,
                              message: "El valor no debe ser mayor a 10",
                            },
                          })}
                          type="number"
                          step="0.01"
                          id="posgusto"
                          placeholder="Nota"
                        ></input>
                      </div>
                      {errors.posgusto && (
                        <p className="error-message">
                          {errors.posgusto.message}
                        </p>
                      )}
                    </div>

                    <div className="itemProv">
                      <div className="entrada">
                        <label>Cuerpo: </label>
                        <input
                          {...register("cuerpo", {
                            required: "Este campo es requerido",
                            pattern: {
                              value: /^(?!0$)\d+(\.\d{1,2})?$/,
                              message: "El valor no debe ser nulo ni menor a 0",
                            },
                            max: {
                              value: 10,
                              message: "El valor no debe ser mayor a 10",
                            },
                          })}
                          type="number"
                          step="0.01"
                          id="cuerpo"
                          placeholder="Nota"
                        ></input>
                      </div>
                      {errors.cuerpo && (
                        <p className="error-message">{errors.cuerpo.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="gropu">
                    <div className="itemProv">
                      <div className="entrada">
                        <label>Sabor: </label>
                        <input
                          {...register("sabor", {
                            required: "Este campo es requerido",
                            pattern: {
                              value: /^(?!0$)\d+(\.\d{1,2})?$/,
                              message: "El valor no debe ser nulo ni menor a 0",
                            },
                            max: {
                              value: 10,
                              message: "El valor no debe ser mayor a 10",
                            },
                          })}
                          type="number"
                          step="0.01"
                          id="sabor"
                          placeholder="Nota"
                        ></input>
                      </div>
                      {errors.sabor && (
                        <p className="error-message">{errors.sabor.message}</p>
                      )}
                    </div>
                    <div className="itemProv">
                      <div className="entrada">
                        <label>Acidez: </label>
                        <input
                          {...register("acidez", {
                            required: "Este campo es requerido",
                            pattern: {
                              value: /^(?!0$)\d+(\.\d{1,2})?$/,
                              message: "El valor no debe ser nulo ni menor a 0",
                            },
                            max: {
                              value: 10,
                              message: "El valor no debe ser mayor a 10",
                            },
                          })}
                          type="number"
                          step="0.01"
                          id="acidez"
                          placeholder="Nota"
                        ></input>
                      </div>
                      {errors.acidez && (
                        <p className="error-message">{errors.acidez.message}</p>
                      )}
                    </div>

                    <div className="itemProv">
                      <div className="entrada">
                        <label>Balance: </label>
                        <input
                          {...register("balance", {
                            required: "Este campo es requerido",
                            pattern: {
                              value: /^(?!0$)\d+(\.\d{1,2})?$/,
                              message: "El valor no debe ser nulo ni menor a 0",
                            },
                            max: {
                              value: 10,
                              message: "El valor no debe ser mayor a 10",
                            },
                          })}
                          type="number"
                          step="0.01"
                          id="balance"
                          placeholder="Nota"
                        ></input>
                      </div>
                      {errors.balance && (
                        <p className="error-message">
                          {errors.balance.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="itemProv">
                  <div className="entrada">
                    <label>Apreciacion: </label>
                    <input
                      {...register("apreciacion", {
                        required: "Este campo es requerido",
                        pattern: {
                          value: /^(?!0$)\d+(\.\d{1,2})?$/,
                          message: "El valor no debe ser nulo ni menor a 0",
                        },
                        max: {
                          value: 10,
                          message: "El valor no debe ser mayor a 10",
                        },
                      })}
                      type="number"
                      step="0.01"
                      id="apreciacion"
                      placeholder="Nota"
                    ></input>
                  </div>
                  {errors.apreciacion && (
                    <p className="error-message">
                      {errors.apreciacion.message}
                    </p>
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

export default IngresarCatacion;

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
