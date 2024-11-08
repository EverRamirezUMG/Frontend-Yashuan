import React from "react";
import { Encabezado, NavBar } from "../components";
import { Navigate, useNavigate } from "react-router-dom";
import { NavBarMovil } from "../components/NavBarMovil";
import { useEffect, useState } from "react";
import Log2 from "../assets/warning2.png";
import swal from "sweetalert2";
import IngresarVehiculo from "../components/mod/IngresarVehiculo";
import "../styles/Mantenimiento.css";
import { set } from "react-hook-form";
import IngresarPrecioPergamino from "../components/mod/IngresarPrecioPergamino";
import IngresarProceso from "../components/mod/IngresarProceso";
import ActualizarProceso from "../components/mod/ActualizarPRoceso";

function Mantenimiento() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/Admin" />;
  }

  const URL = import.meta.env.VITE_URL;
  const [Vehiculos, setVehiculos] = React.useState([]);
  const [proceos, setProcesos] = useState([]);
  const [precio, setPrecio] = useState([]);
  const [IDvehiculo, setIDvehiculo] = React.useState(null);
  const [estadoModalVehiculo, cambiarEstadoModalVehiculo] = useState(false);
  const [estadoModalPrecio, cambiarEstadoModalPrecio] = useState(false);
  const [estadoModalProceso, cambiarEstadoModalProceso] = useState(false);
  const [actualizarProceso, setActualizarProceso] = useState(false);
  const [IDproceso, setIDproceso] = useState(null);
  //-------  OBTENER VEHICULOS  ----------------

  const datoVehiculos = async () => {
    try {
      const response = await fetch(`${URL}vehiculos`);
      const data = await response.json();
      setVehiculos(data);
    } catch (error) {
      console.log(error);
    }
  };

  const eleminarVehiculo = async (IDvehiculo) => {
    try {
      const response = await fetch(`${URL}vehiculos/eliminar/${IDvehiculo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error desconocido");
      }

      datoVehiculos();
      swal.fire({
        title: "Vehiculo Eliminado!",
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
  };

  useEffect(() => {
    const fetchPago = async () => {
      if (IDvehiculo) {
        await eleminarVehiculo(IDvehiculo);
        await datoVehiculos();
        setIDvehiculo(null);
      }
    };
    fetchPago();
  }, [IDvehiculo]);

  //----------------------------------------------------------------//

  //-------------- obtene proceos ------------------------------
  const datoProcesos = async () => {
    try {
      const response = await fetch(`${URL}procesos`);
      const data = await response.json();
      setProcesos(data);
    } catch (error) {
      console.log(error);
    }
  };

  //-------------------------- obtener precios ---------------------
  const datoPrecios = async () => {
    try {
      const response = await fetch(`${URL}procesos/precio`);
      const data = await response.json();
      setPrecio(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal1 = () => {
    datoVehiculos();
    cambiarEstadoModalVehiculo(!estadoModalVehiculo);
  };

  const handleCloseModalPrecio = () => {
    datoPrecios();
    cambiarEstadoModalPrecio(!estadoModalPrecio);
  };
  const handleCloseModalProceso = () => {
    datoProcesos();
    cambiarEstadoModalProceso(!estadoModalProceso);
  };
  const handleCloseModalProcesoActualizar = () => {
    datoProcesos();
    setIDproceso(null);
    setActualizarProceso(!actualizarProceso);
  };

  useEffect(() => {
    datoVehiculos();
    datoProcesos();
    datoPrecios();
  }, []);

  useEffect(() => {
    if (IDproceso) {
      setActualizarProceso(true);
    } else {
      setActualizarProceso(false);
    }
  }, [IDproceso]);
  console.log(IDproceso);
  return (
    <>
      <div className="vista-mantenimiento">
        <NavBar />
        <NavBarMovil />
        <Encabezado titulo="Mantenimiento" />
        <div className="contenedor-mantenimiento">
          <section className="main-pricipal">
            <div className="contenido">
              <div className="titulos">
                <h2>Vehiculos</h2>
                <button
                  onClick={() =>
                    cambiarEstadoModalVehiculo(!estadoModalVehiculo)
                  }
                >
                  Agregar{" "}
                </button>
              </div>

              <div className="tabla">
                <div className="encabezado">
                  <span>ID</span>
                  <span>Marca</span>
                  <span>color</span>
                  <span>Placa</span>
                  <span>Accion</span>
                </div>
                <div className="datos">
                  {Vehiculos.length > 0 ? (
                    Vehiculos.map((item, index) => (
                      <div className="dato" key={index}>
                        <span> {item.pk_vehiculo}</span>
                        <span>{item.marca}</span>
                        <span>{item.color}</span>
                        <span>{item.placa} </span>

                        <div className="botones">
                          <button
                            className="Detalle"
                            onClick={() => {
                              setIDvehiculo(item.pk_vehiculo);
                            }}
                          >
                            <span class="material-symbols-outlined">
                              delete
                            </span>
                          </button>
                          {/* <button
                            className="Detalle"
                            // onClick={() => {
                            //   setID(item.id);
                            //   cambiarEstadoModal2(!estadoModal2);
                            // }}
                          >
                            Ver
                          </button> */}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No hay datos</p>
                  )}
                </div>
              </div>
            </div>
            <IngresarVehiculo
              estado={estadoModalVehiculo}
              cambiarEstado={handleCloseModal1}
              titulo="Registrar Vehiculo"
            />
          </section>

          <section className="main-pricipal">
            <div className="contenido">
              <div className="titulos">
                <h2>Procesos</h2>
                <button
                  onClick={() => cambiarEstadoModalProceso(!estadoModalProceso)}
                >
                  Agregar{" "}
                </button>
              </div>

              <div className="tabla">
                <div className="encabezado">
                  <span>ID</span>
                  <span>Proceso</span>
                  <span>Accion</span>
                </div>
                <div className="datos">
                  {proceos.length > 0 ? (
                    proceos.map((item, index) => (
                      <div className="dato" key={index}>
                        <span> {item.idproceso}</span>
                        <span>{item.proceso}</span>

                        <div className="botones">
                          <button
                            className="Detalle"
                            onClick={() => setIDproceso(item.idproceso)}
                          >
                            <span class="material-symbols-outlined">edit</span>
                          </button>
                          {/* <button
                            className="Detalle"
                            // onClick={() => {
                            //   setID(item.id);
                            //   cambiarEstadoModal2(!estadoModal2);
                            // }}
                          >
                            Ver
                          </button> */}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No hay datos</p>
                  )}
                </div>
              </div>
            </div>
            <IngresarProceso
              estado={estadoModalProceso}
              cambiarEstado={handleCloseModalProceso}
              titulo="Registrar proceso"
            />
            <ActualizarProceso
              estado={actualizarProceso}
              cambiarEstado={handleCloseModalProcesoActualizar}
              titulo="Registrar proceso"
              id={IDproceso}
            />
          </section>

          <section className="main-pricipal">
            <div className="contenido">
              <div className="titulos">
                <h2>Precio pergamino</h2>
                <button
                  onClick={() => cambiarEstadoModalPrecio(!estadoModalPrecio)}
                >
                  Agregar{" "}
                </button>
              </div>

              <div className="tabla">
                <div className="encabezado">
                  <span>ID</span>
                  <span>Proceso</span>
                  <span>Precio</span>
                  <span>Fecha</span>
                </div>
                <div className="datos">
                  {precio.length > 0 ? (
                    precio.map((item, index) => (
                      <div className="dato" key={index}>
                        <span> {item.id}</span>
                        <span> {item.proceso}</span>
                        <span>Q. {item.precio}</span>
                        <span>
                          {new Date(item.fecha).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>No hay datos</p>
                  )}
                </div>
              </div>
            </div>
            <IngresarPrecioPergamino
              estado={estadoModalPrecio}
              cambiarEstado={handleCloseModalPrecio}
              titulo="Registrar Precio pregamino"
            />
          </section>
        </div>
      </div>
    </>
  );
}
export default Mantenimiento;
