import React, { useState, useEffect } from "react";
import styled from "styled-components";
import swal from "sweetalert2";
import "./styles/IniciarCompra.css";
import { useForm } from "react-hook-form";

export const IniciarCompra = ({ children, estado, cambiarEstado, titulo }) => {
  const token = localStorage.getItem("token");
  const codigo = localStorage.getItem("codigo");
  const URL = import.meta.env.VITE_URL;
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

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
          cambiarEstado(false);
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Error desconocido");
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

  const [partida, setPartida] = useState({});
  const [preciodia, setPreciodia] = useState({});
  const [precioFlete, setPrecioFlete] = useState({});

  const precios = async () => {
    try {
      const response = await fetch(URL + "acopio", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });

      const datos = await response.json();

      // Desestructurar los datos recibidos en tres variables distintas

      const { precioDia, precioFlete, partida } = datos;
      setPreciodia(precioDia);
      setPrecioFlete(precioFlete);
      setPartida(partida);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    precios();
  }, []);
  useEffect(() => {
    if (estado === "false") {
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
              <h2>{titulo}</h2>
            </EncabezadoModal>
            <BotonCerrar onClick={() => cambiarEstado(false)}>
              <span className="material-symbols-outlined">close</span>
            </BotonCerrar>
            <div className="containerNewProv">
              <div className="Datos-anteriores">
                <h3>Datos anteriores</h3>
                <br />
                <div className="precios">
                  <p>Partida anterior: #{partida?.partida}</p>
                  <p>Precio base: Q.{preciodia?.preciobase}</p>
                  <p>Flete: Q.{precioFlete?.precio}</p>
                </div>
                <br />
                <h2>Datos de compra</h2>
              </div>
              <form
                className="nuevoProvForm"
                id="FormularioP"
                onSubmit={onSubmit}
              >
                <div className="datos">
                  <div className="gropu">
                    <div className="itemProv">
                      <div className="entrada">
                        <label>Partida: </label>
                        <input
                          {...register("partida", {
                            required: "Este campo es requerido",
                            pattern: {
                              value: /^(?!0$)\d+(\.\d{1,2})?$/,
                              message: "El valor no debe ser nulo ni menor a 0",
                            },
                          })}
                          type="number"
                          step="0.01"
                          id="partida"
                          placeholder="Partida"
                        ></input>
                      </div>
                      {errors.partida && (
                        <p className="error-message">
                          {errors.partida.message}
                        </p>
                      )}
                    </div>

                    <div className="itemProv">
                      <div className="entrada">
                        <label>Precio base: </label>
                        <input
                          {...register("base", {
                            required: "Este campo es requerido",
                            pattern: {
                              value: /^(?!0$)\d+(\.\d{1,2})?$/,
                              message: "El valor no debe ser nulo ni menor a 0",
                            },
                          })}
                          type="number"
                          step="0.01"
                          id="base"
                          placeholder="Precio base"
                        ></input>
                      </div>
                      {errors.base && (
                        <p className="error-message">{errors.base.message}</p>
                      )}
                    </div>

                    <div className="itemProv">
                      <div className="entrada">
                        <label>Socio: </label>
                        <input
                          {...register("socio", {
                            pattern: {
                              value: /^(?!0$)\d+(\.\d{1,2})?$/,
                              message: "El valor no debe ser nulo ni menor a 0",
                            },
                          })}
                          type="number"
                          step="0.01"
                          id="socio"
                          placeholder="Socio"
                        ></input>
                      </div>
                      {errors.socio && (
                        <p className="error-message">{errors.socio.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="gropu">
                    <div className="itemProv">
                      <div className="entrada">
                        <label>Recolector: </label>
                        <input
                          {...register("recolector", {
                            pattern: {
                              value: /^(?!0$)\d+(\.\d{1,2})?$/,
                              message: "El valor no debe ser nulo ni menor a 0",
                            },
                          })}
                          type="number"
                          step="0.01"
                          id="recolector"
                          placeholder="Recolector"
                        ></input>
                      </div>
                      {errors.recolector && (
                        <p className="error-message">
                          {errors.recolector.message}
                        </p>
                      )}
                    </div>
                    <div className="itemProv">
                      <div className="entrada">
                        <label>Especial: </label>
                        <input
                          {...register("especial", {
                            pattern: {
                              value: /^(?!0$)\d+(\.\d{1,2})?$/,
                              message: "El valor no debe ser nulo ni menor a 0",
                            },
                          })}
                          type="number"
                          step="0.01"
                          id="especial"
                          placeholder="Especial"
                        ></input>
                      </div>
                      {errors.especial && (
                        <p className="error-message">
                          {errors.especial.message}
                        </p>
                      )}
                    </div>

                    <div className="itemProv">
                      <div className="entrada">
                        <label>Flete: </label>
                        <input
                          {...register("flete", {
                            required: "Este campo es requerido",
                            pattern: {
                              value: /^(?!0$)\d+(\.\d{1,2})?$/,
                              message: "El valor no debe ser nulo ni menor a 0",
                            },
                          })}
                          type="number"
                          step="0.01"
                          id="flete"
                          placeholder="Flete"
                        ></input>
                      </div>
                      {errors.flete && (
                        <p className="error-message">{errors.flete.message}</p>
                      )}
                    </div>
                  </div>
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
