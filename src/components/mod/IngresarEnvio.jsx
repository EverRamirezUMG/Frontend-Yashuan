import React, { useState, useEffect } from "react";
import styled from "styled-components";
import swal from "sweetalert2";
import "./styles/IngresarEnvio.css";
import { useForm } from "react-hook-form";
import LogCatacion from "../../assets/Logo-Yashuan.png";

const IngresarEnvio = ({
  children,
  estado,
  cambiarEstadoEnvio,
  idventa,
  titulo,
  datos,
}) => {
  const token = localStorage.getItem("token");
  const URL = import.meta.env.VITE_URL;
  const usuario = localStorage.getItem("codigo");
  console.log(datos);
  const [paridas, setPartidas] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const id = idventa;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (formData) => {
    const data = { ...formData, venta: datos.id, cliente: datos.fk_cliente };
    try {
      const response = await fetch(`${URL}envio/ingresar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        cambiarEstadoEnvio(false);
        const errorData = await response.json();
        throw new Error(errorData.message || "Error desconocido");
      }

      cambiarEstadoEnvio(false);
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

  return (
    <>
      {estado && (
        <Overlay>
          <ContenedorModal>
            <EncabezadoModal>
              <div className="encabezado-ingresar-envio">
                <img
                  src={LogCatacion}
                  alt="logo"
                  className="icono"
                  style={{ width: "250px", height: "auto" }}
                />
                <h3>{titulo}</h3>
                <p> Venta: {datos?.id}</p>
                <h3>Cliente: {datos?.nombre}</h3>
                <p>ID: {datos?.fk_cliente}</p>
              </div>
            </EncabezadoModal>
            <BotonCerrar onClick={() => cambiarEstadoEnvio(false)}>
              <span className="material-symbols-outlined">close</span>
            </BotonCerrar>
            <div className="contenedor-ingresar-envio">
              <form className="envio-form" id="FormularioP" onSubmit={onSubmit}>
                <div className="datos-envio">
                  <div className="itemEnv">
                    <div className="entrada-titulo">
                      <p>Tipo de cafe:</p>
                      <h3>{datos?.proceso}</h3>
                    </div>
                    <div className="entrada-titulo">
                      <p>Bultos:</p>
                      <h3>{datos?.tara * 100}</h3>
                    </div>
                    <div className="entrada-titulo">
                      <p>Peso bruto:</p>
                      <h3>{datos?.pesobruto} qq.</h3>
                    </div>
                    <div className="entrada-titulo">
                      <p>Tara:</p>
                      <h3>{datos?.tara} qq.</h3>
                    </div>
                    <div className="entrada-titulo">
                      <p>Peso neto:</p>
                      <h3>{datos?.pesoneto} qq.</h3>
                    </div>
                  </div>
                </div>

                <div className="itemProv">
                  <div className="entrada">
                    <input
                      {...register("destino", {
                        required: "Este campo es requerido",
                      })}
                      type="text"
                      id="destino"
                      placeholder="destino"
                    />
                  </div>
                  {errors.destino && (
                    <p className="error-message">{errors.destino.message}</p>
                  )}
                </div>

                <div className="itemProv">
                  <div className="entrada">
                    <input
                      {...register("lugar", {
                        required: "Este campo es requerido",
                      })}
                      type="text"
                      id="lugar"
                      placeholder="Direccion"
                    />
                  </div>
                  {errors.lugar && (
                    <p className="error-message">{errors.lugar.message}</p>
                  )}
                </div>
                <div className="itemProv">
                  <div className="entrada">
                    <input
                      {...register("piloto", {
                        required: "Este campo es requerido",
                      })}
                      type="text"
                      id="piloto"
                      placeholder="Piloto"
                    />
                  </div>
                  {errors.piloto && (
                    <p className="error-message">{errors.piloto.message}</p>
                  )}
                </div>
                <div className="itemProv">
                  <div className="entrada">
                    <input
                      {...register("placa", {
                        required: "Este campo es requerido",
                        pattern: {
                          value: /^[A-Z]-\d{3}[A-Z]{3}$/i,
                          message: "La placa debe ser en formato C-000ABC",
                        },
                      })}
                      type="text"
                      step="0.01"
                      id="placa"
                      placeholder="Placa"
                    />
                  </div>
                  {errors.placa && (
                    <p className="error-message">{errors.placa.message}</p>
                  )}
                </div>
                <div className="itemProv">
                  <div className="entrada">
                    <input
                      {...register("licencia", {
                        required: "Este campo es requerido",
                        pattern: {
                          value: /^\d{13}$/i,
                          message: "El valor no debe ser nulo ",
                        },
                      })}
                      type="number"
                      step="1"
                      id="licencia"
                      placeholder="Licencia"
                    ></input>
                  </div>
                  {errors.licencia && (
                    <p className="error-message">{errors.licencia.message}</p>
                  )}
                </div>

                <div className="itemProv">
                  <div className="entrada">
                    <input
                      {...register("costo", {
                        required: "Este campo es requerido",
                      })}
                      type="number"
                      id="costo"
                      placeholder="Costo por quintal"
                    />
                  </div>
                  {errors.lugar && (
                    <p className="error-message">{errors.lugar.message}</p>
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

export default IngresarEnvio;

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
