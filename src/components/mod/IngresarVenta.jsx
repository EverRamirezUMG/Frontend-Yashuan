import React, { useState, useEffect } from "react";
import styled from "styled-components";
import swal from "sweetalert2";
import "./styles/IngresarVenta.css";
import { useForm } from "react-hook-form";
import LogCatacion from "../../assets/Logo-Yashuan.png";
import IngresarCliente from "./IngresarCliente";

const IngresarVenta = ({
  children,
  estado,
  cambiarEstado,
  idpartida,
  titulo,
}) => {
  const token = localStorage.getItem("token");
  const URL = import.meta.env.VITE_URL;
  const usuario = localStorage.getItem("codigo");
  console.log(usuario);
  const [paridas, setPartidas] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [estadoModalCliente, cambiarEstadoModalCliente] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (formData) => {
    const data = { ...formData, usuario };
    try {
      const response = await fetch(`${URL}ventas/ingresar`, {
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

  const listaPartidas = async () => {
    try {
      const response = await fetch(`${URL}muestras/partidas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const procesos = await fetch(`${URL}inventario/proceso`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const clientes = await fetch(`${URL}muestras/clientes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error desconocido");
      }

      const data = await response.json();
      const procesosData = await procesos.json();
      const clientesData = await clientes.json();

      setPartidas(data);
      setProcesos(procesosData);
      setClientes(clientesData);
      return data;
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
  };

  register("usuario", { value: usuario });

  useEffect(() => {
    listaPartidas();
  }, []);

  useEffect(() => {
    if (estado === false) {
      const form = document.getElementById("FormularioP");
      if (form) {
        form.reset();
      }
    }
  }, [estado]);

  useEffect(() => {
    if (estado === false) {
      reset(); // Resetea el formulario cuando se cierra el modal
    }
  }, [estado, reset]); // Asegúrate de incluir 'reset' en las dependencias

  const handleCloseModalCliente = () => {
    listaPartidas();
    cambiarEstadoModalCliente(!estadoModalCliente);
  };
  return (
    <>
      {estado && (
        <Overlay>
          <ContenedorModal>
            <EncabezadoModal>
              <div className="encabezado-ingresar-venta">
                <img
                  src={LogCatacion}
                  alt="logo"
                  className="icono"
                  style={{ width: "290px", height: "auto" }}
                />
                <h2>{titulo}</h2>
              </div>
            </EncabezadoModal>
            <BotonCerrar onClick={() => cambiarEstado(false)}>
              <span className="material-symbols-outlined">close</span>
            </BotonCerrar>
            <IngresarCliente
              estado={estadoModalCliente}
              cambiarEstado={handleCloseModalCliente}
              titulo="Registrar clietne"
            />
            <div className="contenedor-ingresar-venta">
              <form className="venta-form" id="FormularioP" onSubmit={onSubmit}>
                <div className="itemProv">
                  <div className="entrada">
                    <select
                      name="cliente"
                      id="cliente"
                      {...register("cliente", {
                        required: "Este campo es requerido",
                      })}
                    >
                      {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.id} - {cliente.nombre}
                        </option>
                      ))}
                    </select>
                    <button
                      className="agregar"
                      onClick={() =>
                        cambiarEstadoModalCliente(!estadoModalCliente)
                      }
                    >
                      <span class="material-symbols-outlined">add</span>
                    </button>
                  </div>

                  {errors.cliente && (
                    <p className="error-message">{errors.cliente.message}</p>
                  )}
                </div>

                <div className="datos-muestra">
                  <div className="grupo">
                    <div className="itemProv">
                      <div className="entrada">
                        <select
                          name="proceso"
                          id="proceso"
                          {...register("proceso", {
                            required: "Este campo es requerido",
                          })}
                        >
                          <option value={0}>Seleccionar proceso</option>
                          {procesos.map((proceso) => (
                            <option key={proceso.id} value={proceso.id}>
                              {proceso.proceso}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.proceso && (
                        <p className="error-message">
                          {errors.proceso.message}
                        </p>
                      )}
                    </div>

                    <div className="itemProv">
                      <div className="entrada">
                        <label htmlFor="peso">Peso: </label>
                        <input
                          {...register("peso", {
                            pattern: {
                              value: /^(?!0$)\d+(\.\d{1,2})?$/,
                              message: "El valor no debe ser nulo ni menor a 0",
                            },
                          })}
                          type="number"
                          step="0.01"
                          id="peso"
                          placeholder="quintales"
                        />
                      </div>
                      {errors.peso && (
                        <p className="error-message">{errors.peso.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grupo">
                    <div className="itemProv">
                      <div className="entrada">
                        <label>Tara: </label>
                        <input
                          {...register("tara", {
                            required: "Este campo es requerido",
                            pattern: {
                              value: /^(?!0$)\d+(\.\d{1,2})?$/,
                              message: "El valor no debe ser nulo ni menor a 0",
                            },
                          })}
                          type="number"
                          step="0.01"
                          id="tara"
                          placeholder="Bultos"
                        ></input>
                      </div>
                      {errors.cantidad && (
                        <p className="error-message">
                          {errors.cantidad.message}
                        </p>
                      )}
                    </div>

                    <div className="itemProv">
                      <div className="entrada">
                        <label>Anticipo: </label>
                        <input
                          {...register("anticipo", {
                            setValueAs: (value) => (value === "" ? 0 : value),
                          })}
                          type="number"
                          step="0.01"
                          id="anticipo"
                          placeholder="Costo Q."
                        ></input>
                      </div>
                      {errors.cantidad && (
                        <p className="error-message">
                          {errors.cantidad.message}
                        </p>
                      )}
                    </div>

                    <div className="itemProv">
                      <div className="entrada">
                        <label>Pago: </label>
                        <input
                          {...register("pago", {
                            setValueAs: (value) => (value === "" ? 0 : value),
                          })}
                          type="number"
                          step="0.01"
                          id="envio"
                          placeholder="Q."
                        ></input>
                      </div>
                      {errors.cantidad && (
                        <p className="error-message">
                          {errors.cantidad.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="itemProv">
                  <div className="entrada">
                    <input
                      {...register("observacion")}
                      type="text"
                      id="observacion"
                      placeholder="Observacion"
                    />
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

export default IngresarVenta;

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
