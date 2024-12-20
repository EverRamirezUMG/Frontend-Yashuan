import React from "react";
import NavBar from "../components/NavBarDesk";
import Encabezado from "../components/Encabezado";
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

function Fletes() {
  const URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [fecha1, setFecha1] = useState("");
  const [fecha2, setFecha2] = useState("");
  const [id, setID] = useState([]);
  const [fletes, setFletes] = useState([]);
  const [estadoModal1, cambiarEstadoModal1] = useState(false);
  const [estadoModal2, cambiarEstadoModal2] = useState(false);
  const [vehiculoseleccionado, setVehiculoSeleccionado] = useState(null);
  const [vehiculos, setVehiculos] = useState({});

  const [totales, setTotales] = useState("");

  console.log(totales?.total);
  if (!token) {
    return <Navigate to="/Admin" />;
  }

  const datos = async () => {
    try {
      const clientes = await fetch(`${URL}fletes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });

      const totales = await fetch(`${URL}fletes/totales`, {
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

      const totalesData = await totales.json();

      setFletes(clientesData);
      setTotales(totalesData);
    } catch (err) {
      console.error(err);
    }
  };

  const obtenervehiculos = async (id) => {
    try {
      const response = await fetch(`${URL}acopio/vehiculo`, {
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
      setVehiculos(data);
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
    obtenervehiculos();
  }, []);

  //--------------------- COMPRA POR RANGO DE FECHA ---------------------
  const rangoFletes = async () => {
    try {
      const response = await fetch(
        `${URL}fletes/rango?fecha1=${encodeURIComponent(
          fecha1
        )}&fecha2=${encodeURIComponent(fecha2)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        }
      );
      const totales = await fetch(
        `${URL}fletes/totalesrango?fecha1=${encodeURIComponent(
          fecha1
        )}&fecha2=${encodeURIComponent(fecha2)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();
      const total = await totales.json();

      setFletes(data);
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
    result = fletes;
  } else {
    result = fletes.filter(
      (datos) =>
        datos.id_vehiculo.toString().includes(search) ||
        datos.comprobante.toLowerCase().includes(search.toLowerCase()) ||
        datos.nombre.toLowerCase().includes(search.toLowerCase()) ||
        datos.vehiculo.toLowerCase().includes(search.toLowerCase()) ||
        datos.aliaas.toLowerCase().includes(search.toLowerCase())
    );
  }

  const handleVehiculoChange = (event) => {
    setVehiculoSeleccionado(event.target.value);
  };

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

  const obtenerDatos = async () => {
    try {
      const response = await fetch(
        `${URL}fletes/flete/${vehiculoseleccionado}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const total = await fetch(
        `${URL}fletes/vehiculo/${vehiculoseleccionado}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();
      const totalData = await total.json();
      setTotales(totalData);

      setFletes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Verifica si vehiculoSeleccionado es un string no vacío
    if (vehiculoseleccionado) {
      obtenerDatos();
    } else {
      datos();
    }
  }, [vehiculoseleccionado]);

  return (
    <>
      <div className="vista-muestras">
        <NavBar />
        <NavBarMovil />
        <Encabezado titulo="Fletes" />
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
                    {/* <h3>Fletes registrados</h3> */}
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
                      <button type="button" onClick={rangoFletes}>
                        Aceptar
                      </button>
                    </div>
                    <p>Total: Q. {parseFloat(totales?.total) * -1 || 0}</p>
                    <div className="buscador">
                      <input
                        type="text"
                        placeholder="Buscar comprobante o vehiculo"
                        onChange={searcher}
                      />
                      <button>
                        <span className="material-symbols-outlined">
                          search
                        </span>
                      </button>
                    </div>

                    <div className="Rango-fecha2">
                      <select
                        name="vehiculo"
                        id="vehiculo"
                        value={vehiculoseleccionado}
                        onChange={handleVehiculoChange}
                      >
                        <option value="">Todos los vehículos</option>
                        {vehiculos.length > 0 ? (
                          vehiculos.map((vehiculo, index) => (
                            <option key={index} value={vehiculo.codigo}>
                              {vehiculo.alias || vehiculo.vehiculo}
                            </option>
                          ))
                        ) : (
                          <option value={null}>
                            No hay vehículos disponibles
                          </option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="tabla">
                    <div className="encabezado">
                      <span>ID</span>
                      <span>Productor</span>
                      <span>Comprobante</span>
                      <span>Peso</span>
                      <span>Precio / qq.</span>
                      <span>Flete</span>
                      <span>ID vehiculo</span>
                      <span>Vehiculo</span>
                      <span>fecha</span>
                    </div>
                    <div className="datos">
                      {result.length > 0 ? (
                        result.map((item, index) => (
                          <div className="dato" key={index}>
                            <span> {item.id}</span>
                            <span>{item.nombre}</span>
                            <span>{item.comprobante}</span>
                            <span>{item.peso_neto}</span>
                            <span>{item.precio_por_quintal} </span>
                            <span>{item.flete * -1} </span>
                            <span>{item.id_vehiculo} </span>
                            <span>{item.aliaas || item.vehiculo} </span>

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

                            {/* <div className="botones">
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
                            </div> */}
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
export default Fletes;
