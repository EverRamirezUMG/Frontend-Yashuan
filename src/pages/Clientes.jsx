import React from "react";
import { Encabezado, NavBar } from "../components";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { NavBarMovil } from "../components/NavBarMovil";
import { TailSpin } from "react-loader-spinner";
import "react-datepicker/dist/react-datepicker.css";
import ChartDias from "../components/chart/chart1";
import PieResumenAcopio from "../components/chart/Pie-resumen-acopio";
import Swal from "sweetalert2";
import GenerarReporte from "../components/PDF/ResumenAcopio";
import ExcelGenerator from "../components/EXCEL/ResumenAcopioExcel";
import "../styles/Muestras.css";
import VerMuestra from "../components/mod/VerMuestra";
import IngresarCliente from "../components/mod/IngresarCliente";
import VerCliente from "../components/mod/VerCliente";

function Clientes() {
  const URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [fecha1, setFecha1] = useState("");
  const [fecha2, setFecha2] = useState("");
  const [id, setID] = useState([]);
  const [precio, setPrecio] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState([]);
  const [cantidad, setCantidad] = useState([]);
  const [partidaSeleccionada, setPartidaSeleccionada] = useState(null);
  const [estadoModal1, cambiarEstadoModal1] = useState(false);
  const [estadoModal2, cambiarEstadoModal2] = useState(false);

  const [totales, setTotales] = useState("");

  if (!token) {
    return <Navigate to="/Admin" />;
  }

  console.log(id);
  console.log(clientes);
  const datos = async () => {
    try {
      const clientes = await fetch(`${URL}clientes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });

      const muestra = await fetch(`${URL}muestras`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      const cantidad = await fetch(`${URL}inventario/stock`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      const totales = await fetch(`${URL}muestras/totales`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      const precio = await fetch(`${URL}muestras/precio`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });

      if (!clientes.ok) {
        throw new Error("Error en la solicitud");
      }

      const clientesData = await clientes.json();
      const cantidadData = await cantidad.json();
      const totalesData = await totales.json();
      const precioData = await precio.json();
      const muestraData = await muestra.json();

      setClientes(clientesData);
      setCantidad(cantidadData);
      setTotales(totalesData);
      setPrecio(precioData);
      setCliente(muestraData);
    } catch (err) {
      console.error(err);
    }
  };

  const obtenerMuestra = async (id) => {
    try {
      const response = await fetch(`${URL}clientes/cliente/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();
      setCliente(data);
    } catch (err) {
      console.error(err);
    }
  };
  //--------------- INGRESO DE CAFE PERGAMINO A BODEGA ----------------

  //---------------------- DISPONIBILIDAD DE PERGAMINO ---------------------

  const disponibilidadPergamino = async () => {
    try {
      const response = await fetch(`${URL}inventario/disponibilidad`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();
      setDisponibilidad(data);
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",

        title: "Error en la solicitud",
        text: err.message,
      });
    }
  };

  useEffect(() => {
    disponibilidadPergamino();
    datos();
  }, []);

  //--------------------- COMPRA POR RANGO DE FECHA ---------------------
  const rangoPergamino = async () => {
    try {
      const response = await fetch(
        `${URL}clientes/fecha?fecha1=${encodeURIComponent(
          fecha1
        )}&fecha2=${encodeURIComponent(fecha2)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const totales = await fetch(
        `${URL}muestras/rtotal?fecha1=${encodeURIComponent(
          fecha1
        )}&fecha2=${encodeURIComponent(fecha2)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();
      const total = await totales.json();

      setClientes(data);
      setTotales(total);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error en la solicitud",
        text: err.message,
      });
    }
  };

  //------------------ BUSQUEDA INTELIGENTE------------ */
  const [search, setSearch] = useState("");
  const searcher = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };
  //----metodo de filtrado de busqueda-----
  let result = [];
  if (!search) {
    result = clientes;
  } else {
    result = clientes.filter(
      (datos) =>
        datos.id.toString().includes(search) ||
        datos.email.toLowerCase().includes(search.toLowerCase()) ||
        datos.nombre.toLowerCase().includes(search.toLowerCase())
    );
  }

  //------------------- ESCUCHAR DATOS EN TIEMPO REAL ---------------------
  // useEffect(() => {
  //   ResumenAcopio();
  //   const interval = setInterval(() => {
  //     ResumenAcopio();
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [token]);

  const formatNumber = (number) => {
    return new Intl.NumberFormat("es-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await datos();

      setLoading(false);
    };

    fetchData();
  }, []);

  //------------------- MODAL ---------------------
  const handleCloseModal1 = () => {
    disponibilidadPergamino();
    datos();
    cambiarEstadoModal1(!estadoModal1);
  };
  const handleCloseModal2 = () => {
    cambiarEstadoModal2(!estadoModal2);
    setID(null);
  };
  useEffect(() => {
    const fetchMuestra = async () => {
      if (id) {
        await obtenerMuestra(id);
      }
    };
    fetchMuestra();
  }, [id]);

  useEffect(() => {
    if (estadoModal1) {
      datos();
    }
  }, [estadoModal1]);

  return (
    <>
      <div className="vista-muestras">
        <NavBar />
        <NavBarMovil />
        <Encabezado titulo="Clientes" />
        <div className="container-muestras">
          {loading ? (
            <div
              className="loader"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <TailSpin
                visible={true}
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          ) : (
            <>
              <div className="main-muestras">
                <section className="main-muestras-ingresadas">
                  <div className="titulo">
                    <h3>Clientes registrdos</h3>
                    <div className="rango-fecha">
                      <p>Rango:</p>
                      <input
                        type="date"
                        className="calendario-b"
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                          setFecha1(e.target.value);
                          if (new Date(e.target.value) > new Date(fecha2)) {
                            setFecha2("");
                          }
                        }}
                        value={fecha1}
                      />
                      <input
                        type="date"
                        className="calendario-b"
                        min={fecha1}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setFecha2(e.target.value)}
                        value={fecha2}
                      />
                      <button type="button" onClick={rangoPergamino}>
                        Aceptar
                      </button>
                    </div>
                    <div className="buscador">
                      <input
                        type="text"
                        placeholder="Buscar partida, proceso o cliente"
                        onChange={searcher}
                      />
                      <button>
                        <span className="material-symbols-outlined">
                          search
                        </span>
                      </button>
                    </div>
                    <IngresarCliente
                      estado={estadoModal1}
                      cambiarEstado={handleCloseModal1}
                      idpartida={partidaSeleccionada}
                      titulo="Registrar clietne"
                    />
                    <div className="Rango-fecha2">
                      {/* <ExcelGenerator data={pergamino} head={""} /> */}
                      <GenerarReporte data={clientes} head={""} />
                      <button
                        onClick={() => cambiarEstadoModal1(!estadoModal1)}
                      >
                        Registrar +
                      </button>
                    </div>
                  </div>

                  <div className="tabla">
                    <div className="encabezado">
                      <span>ID</span>
                      <span>Cliente</span>
                      <span>Telefono</span>
                      <span>Correo</span>
                      <span>DPI</span>
                      <span>fecha</span>
                      <span>Accion</span>
                    </div>
                    <div className="datos">
                      {result.length > 0 ? (
                        result.map((item, index) => (
                          <div className="dato" key={index}>
                            <span> {item.id}</span>
                            <span>{item.nombre}</span>
                            <span>{item.telefono}</span>
                            <span>{item.email}</span>
                            <span>{item.dpi} </span>

                            <span>
                              {" "}
                              {new Date(item.fecha).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>

                            <div className="botones">
                              <button
                                className="Detalle"
                                onClick={() => {
                                  setID(item.id);
                                  cambiarEstadoModal2(!estadoModal2);
                                }}
                              >
                                <span class="material-symbols-outlined">
                                  edit
                                </span>
                              </button>
                              <button
                                className="Detalle"
                                onClick={() => {
                                  setID(item.id);
                                  cambiarEstadoModal2(!estadoModal2);
                                }}
                              >
                                Ver
                              </button>
                            </div>
                            {/* <span>
                              Q. {Number(item.total).toLocaleString()}
                            </span>
                            <span>Q. {Number(item.pago).toLocaleString()}</span> */}
                            {/* <div className="botones">
                              <button className="editar">
                              <span className="material-symbols-outlined">
                                edit
                              </span>
                            </button>
                            <button className="eliminar">
                              <span className="material-symbols-outlined">
                                delete
                              </span>
                            </button>
                            </div> */}
                          </div>
                        ))
                      ) : (
                        <p>No hay datos</p>
                      )}

                      <VerCliente
                        estado={estadoModal2}
                        cambiarEstado={handleCloseModal2}
                        idpartida={cliente?.id}
                        titulo={cliente?.nombre}
                      >
                        <div className="modal">
                          <div className="modal-header">
                            <h3>Datos del cliente</h3>
                          </div>
                          <div className="modal-body">
                            <div className="modal-body-1">
                              <h4>Telefono:</h4>
                              <p>{cliente?.telefono}</p>
                            </div>
                            <div className="modal-body-1">
                              <h4>Correo:</h4>
                              <p>{cliente?.email}</p>
                            </div>

                            <div className="modal-body-1">
                              <h4>DPI: </h4>
                              <p>{cliente?.dpi}</p>
                            </div>
                            <div className="modal-body-1">
                              <h4>Fechas de registro:</h4>
                              <p>{cliente?.fecha}</p>
                            </div>

                            <div className="modal-body-1">
                              <h4>Muestras enviadas:</h4>
                              <p>{cliente?.muestras}</p>
                            </div>

                            <div className="modal-body-1">
                              <h4>Compras realizadas:</h4>
                              <p>{cliente?.compras}</p>
                            </div>
                          </div>
                        </div>
                      </VerCliente>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default Clientes;
