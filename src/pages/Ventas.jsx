import React from "react";
import { Encabezado, NavBar } from "../components";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { NavBarMovil } from "../components/NavBarMovil";
import { TailSpin } from "react-loader-spinner";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import GenerarReporte from "../components/PDF/ResumenAcopio";
import "../styles/Ventas.css";
import IngresarVenta from "../components/mod/IngresarVenta";
import VerVenta from "../components/mod/VerVenta";
import IngresarEnvio from "../components/mod/IngresarEnvio";
import ComprobanteVenta from "../components/PDF/ComprobanteVenta";
import VerEnvio from "../components/mod/VerEnvio";
import GenerarEnvio from "../components/PDF/GenerarEnvio";

function Ventas() {
  const URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");

  const [fecha1, setFecha1] = useState("");
  const [fecha2, setFecha2] = useState("");
  const [id, setID] = useState([]);
  const [idPago, setIDpago] = useState(null);
  const [idEnvio, setIDenvio] = useState([]);
  const [Envio, setEnvio] = useState([]);
  const [precio, setPrecio] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [venta, setVenta] = useState([]);
  const [cantidad, setCantidad] = useState([]);
  const [totales, setTotales] = useState("");
  const [partidaSeleccionada, setPartidaSeleccionada] = useState(null);
  const [estadoModal1, cambiarEstadoModal1] = useState(false);
  const [estadoModal2, cambiarEstadoModal2] = useState(false);
  const [estadoModalEnvio, cambiarEstadoModalEnvio] = useState(false);
  const [estadoModalVerEnvio, cambiarEstadoModalVerEnvio] = useState(false);

  console.log(Envio);

  if (!token) {
    return <Navigate to="/Admin" />;
  }

  const datos = async () => {
    try {
      const ventas = await fetch(`${URL}ventas`, {
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
      const totales = await fetch(`${URL}ventas/totales`, {
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

      if (!ventas.ok) {
        throw new Error("Error en la solicitud");
      }

      const pergaminoData = await ventas.json();
      const cantidadData = await cantidad.json();
      const totalesData = await totales.json();
      const precioData = await precio.json();

      setVentas(pergaminoData);
      setCantidad(cantidadData);
      setTotales(totalesData);
      setPrecio(precioData);
    } catch (err) {
      console.error(err);
    }
  };

  const obtenerMuestra = async (id) => {
    try {
      const response = await fetch(`${URL}ventas/${id}`, {
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
      setVenta(data);
    } catch (err) {
      console.error(err);
    }
  };

  const obtenerEnvio = async (idEnvio) => {
    try {
      const response = await fetch(`${URL}envio/${idEnvio}`, {
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
      setEnvio(data);
    } catch (err) {
      console.error(err);
    }
  };

  //--------------- INGRESO DE CAFE PERGAMINO A BODEGA ----------------

  useEffect(() => {
    datos();
  }, []);

  //--------------------- COMPRA POR RANGO DE FECHA ---------------------
  const rangoPergamino = async () => {
    try {
      const response = await fetch(
        `${URL}ventas/fecha?fecha1=${encodeURIComponent(
          fecha1
        )}&fecha2=${encodeURIComponent(fecha2)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const totales = await fetch(
        `${URL}ventas/rtotal?fecha1=${encodeURIComponent(
          fecha1
        )}&fecha2=${encodeURIComponent(fecha2)}`,
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
      const total = await totales.json();

      setVentas(data);
      setTotales(total);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error en la solicitud",
        text: err.message,
      });
    }
  };

  //----------------------- PAGO DE VENTA ---------------------

  const pagarVenta = async (idPago) => {
    try {
      const response = await fetch(`${URL}ventas/pago/${idPago}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      datos();
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
    result = ventas;
  } else {
    result = ventas.filter(
      (datos) =>
        datos.id.toString().includes(search) ||
        datos.proceso.toLowerCase().includes(search.toLowerCase()) ||
        datos.nombre.toLowerCase().includes(search.toLowerCase()) ||
        datos.fecha.toLowerCase().includes(search.toLowerCase())
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
    datos();
    cambiarEstadoModal1(!estadoModal1);
  };

  const handleCloseModal2 = () => {
    cambiarEstadoModal2(!estadoModal2);
    setID(null);
    datos();
  };
  const handleCloseModalEnvio = () => {
    cambiarEstadoModalEnvio(!estadoModalEnvio);
    setID(null);
    datos();
  };
  const handleCloseModalVerEnvio = () => {
    cambiarEstadoModalVerEnvio(!estadoModalVerEnvio);
    setID(null);
    datos();
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
    const fetchEnvio = async () => {
      if (idEnvio) {
        await obtenerEnvio(idEnvio);
      }
    };
    fetchEnvio();
  }, [idEnvio]);

  useEffect(() => {
    const fetchPago = async () => {
      if (idPago) {
        await pagarVenta(idPago);
        await datos();
      }
    };
    fetchPago();
  }, [idPago]);

  useEffect(() => {
    if (estadoModal1) {
      datos();
    }
  }, [estadoModal1]);

  return (
    <>
      <div className="vista-ventas">
        <NavBar />
        <NavBarMovil />
        <Encabezado titulo="Ventas" />
        <div className="container-ventas">
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
              <div className="main-1-disponibilidad">
                <article className="info-disponibilidad">
                  <div className="titulo">
                    <div className="subtitulo">
                      <h4>Disponibilidad:</h4>
                      <h6>Precio pergamino: Q. {precio?.precio}</h6>
                    </div>
                    <div className="subtitulo">
                      <h3>{cantidad?.cantidad}</h3>
                      <p>Quintales</p>
                    </div>
                  </div>
                </article>

                <section className="contenedor-totales">
                  <div className="precioT">
                    <h3>{totales?.peso_total || 0} qq.</h3>
                    <h6>Cantidad vendida</h6>
                  </div>

                  <div className="precioT">
                    <h3>{totales?.peso_lavado || 0} qq.</h3>
                    <h6>Lavado</h6>
                  </div>
                  <div className="precioT">
                    <h3>{totales?.peso_honey || 0} qq.</h3>
                    <h6>Honey</h6>
                  </div>
                  <div className="precioT">
                    <h3>{totales?.peso_natural || 0} qq.</h3>
                    <h6>Natural</h6>
                  </div>
                </section>
              </div>
              <div className="main-ventas">
                <section className="main-ventas-ingresadas">
                  <div className="titulo">
                    <h3>Ventas registrdas</h3>
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
                    <IngresarVenta
                      estado={estadoModal1}
                      cambiarEstado={handleCloseModal1}
                      idpartida={partidaSeleccionada}
                      titulo="Registrar venta"
                    />
                    <IngresarEnvio
                      estado={estadoModalEnvio}
                      idventa={id}
                      cambiarEstadoEnvio={handleCloseModalEnvio}
                      datos={venta}
                      titulo={"Generar Envio"}
                    />

                    <div className="Rango-fecha2">
                      {/* <ExcelGenerator data={pergamino} head={""} /> */}
                      {/* <GenerarReporte data={ventas} head={""} /> */}
                      <button
                        onClick={() => cambiarEstadoModal1(!estadoModal1)}
                      >
                        Registrar +
                      </button>
                    </div>
                  </div>

                  <div className="tabla">
                    <div className="encabezado">
                      <span>ID venta</span>
                      <span>Cliente</span>
                      <span>Producto</span>

                      <span>Cantidad</span>
                      <span>Anticipo</span>

                      <span>Pago total</span>
                      <span>Fecha </span>
                      <span>Precio </span>
                      <span>Responsable</span>
                      <span>Observacion</span>
                      <span>Accion</span>
                    </div>
                    <div className="datos">
                      {result.length > 0 ? (
                        result.map((item, index) => (
                          <div className="dato" key={index}>
                            <span>{item.id}</span>
                            <span> {item.nombre}</span>
                            <span>{item.proceso}</span>

                            <span>{item.pesoneto} qq</span>
                            <span>Q. {formatNumber(item.anticipo)}</span>
                            <span>Q. {formatNumber(item.total)}</span>

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
                            <span>Q. {formatNumber(item.precio)}</span>

                            <span>{item.usuario}</span>
                            <span>{item.observacion}</span>
                            <div className="botones">
                              {item.envio === true ? (
                                <button
                                  className="Envio"
                                  onClick={() => {
                                    setIDenvio(item.pk_envio);
                                    cambiarEstadoModalVerEnvio(
                                      !estadoModalVerEnvio
                                    );
                                  }}
                                >
                                  <span class="material-symbols-outlined">
                                    visibility
                                  </span>
                                </button>
                              ) : (
                                <button
                                  className="Envio"
                                  onClick={() => {
                                    setID(item.id);
                                    cambiarEstadoModalEnvio(!estadoModalEnvio);
                                  }}
                                >
                                  <span class="material-symbols-outlined">
                                    send
                                  </span>
                                </button>
                              )}

                              {parseFloat(item.pago) >=
                              parseFloat(item.total) ? (
                                <div className="Pagado">
                                  <p>Pagado</p>
                                </div>
                              ) : (
                                <button
                                  className="Pagar"
                                  onClick={() => {
                                    setIDpago(item.id);
                                  }}
                                >
                                  Pagar
                                </button>
                              )}

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
                          </div>
                        ))
                      ) : (
                        <p>No hay datos</p>
                      )}

                      <VerVenta
                        estado={estadoModal2}
                        cambiarEstado={handleCloseModal2}
                        idpartida={venta?.fk_cliente}
                        titulo={venta?.id}
                        cliente={venta?.nombre}
                        total={venta?.pesoneto}
                        fecha={new Date(venta?.fecha).toLocaleDateString(
                          "es-ES",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                        usuario={venta?.usuario}
                      >
                        <div className="modal">
                          <div className="modal-header">
                            <h3>Estado de pago:</h3>
                            <h3>
                              {parseFloat(venta?.pago) >=
                              parseFloat(venta?.total)
                                ? "Cancelado"
                                : "Pago pendiente"}
                            </h3>
                          </div>
                          <div className="modal-body">
                            <div className="modal-body-1">
                              <h4>Producto</h4>
                              <p>{venta?.proceso}</p>
                            </div>

                            <div className="modal-body-1">
                              <h4>Peso bruto</h4>
                              <p>{venta?.pesobruto} qq.</p>
                            </div>

                            <div className="modal-body-1">
                              <h4>Bultos</h4>
                              <p>{venta?.tara * 100}</p>
                            </div>
                            <div className="modal-body-1">
                              <h4>Peso neto</h4>
                              <p>{venta?.pesoneto} qq.</p>
                            </div>

                            <div className="modal-body-1">
                              <h4>Precio pergamino</h4>
                              <p>Q. {formatNumber(venta?.precio)} / qq.</p>
                            </div>
                            <div className="modal-body-1">
                              <h4>Costo total</h4>
                              <p>Q. {formatNumber(venta?.total)}</p>
                            </div>
                            <div className="modal-body-1">
                              <h4>Anticipo</h4>
                              <p>Q. {formatNumber(venta?.anticipo)}</p>
                            </div>
                            <div className="modal-body-1">
                              <h4>Pago</h4>
                              <p>Q. {formatNumber(venta?.pago)}</p>
                            </div>
                            <div className="modal-body-1">
                              <h4>Observacion</h4>
                              <p>
                                {venta?.observacion ? venta.observacion : "N/A"}
                              </p>
                            </div>
                            {parseFloat(venta?.pago) >=
                            parseFloat(venta?.total) ? (
                              <ComprobanteVenta data={venta} />
                            ) : null}
                            {/* <ComprobanteVenta data={venta} /> */}
                          </div>
                        </div>
                      </VerVenta>

                      <VerEnvio
                        estado={estadoModalVerEnvio}
                        cambiarEstado={handleCloseModalVerEnvio}
                        idpartida={Envio?.venta}
                        titulo={Envio?.id}
                        cliente={Envio?.cliente}
                        total={Envio?.neto}
                        fecha={new Date(Envio?.fecha).toLocaleDateString(
                          "es-ES",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                        usuario={venta?.usuario}
                      >
                        <div className="modal">
                          <div className="modal-header">
                            {/* <h3>Estado de pago:</h3>
                            <h3>
                              {parseFloat(venta?.pago) >=
                              parseFloat(venta?.total)
                                ? "Cancelado"
                                : "Pago pendiente"}
                            </h3> */}
                            <h3>Destino: </h3>
                            <h3>{Envio?.destino}</h3>
                          </div>
                          <div className="modal-body">
                            <div className="modal-body-1">
                              <h4>Direccion:</h4>
                              <p>{Envio?.lugar}</p>
                            </div>
                            <div className="modal-body-1">
                              <h4>Peso bruto</h4>
                              <p>{Envio?.bruto} qq.</p>
                            </div>

                            <div className="modal-body-1">
                              <h4>Bultos</h4>
                              <p>{Envio?.tara * 100}</p>
                            </div>
                            <div className="modal-body-1">
                              <h4>Peso neto</h4>
                              <h3>{Envio?.neto} qq.</h3>
                            </div>

                            <div className="modal-body-1">
                              <h4>Costo envio:</h4>
                              <p>Q. {formatNumber(Envio?.costo)}</p>
                            </div>
                          </div>
                          <div>
                            <br />
                          </div>
                          <div className="modal-body">
                            <div className="modal-body-1">
                              <h4>Piloto:</h4>
                              <p>{Envio?.piloto ? Envio?.piloto : "N/A"}</p>
                            </div>
                            <div className="modal-body-1">
                              <h4>Licencia:</h4>
                              <p>{Envio?.licencia ? Envio?.licencia : "N/A"}</p>
                            </div>
                            <div className="modal-body-1">
                              <h4>Placa:</h4>
                              <p>{Envio?.placa ? Envio?.placa : "N/A"}</p>
                            </div>
                          </div>
                          <GenerarEnvio data={Envio} />
                        </div>
                      </VerEnvio>
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
export default Ventas;
