import { Encabezado, NavBar } from "../components";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ChartDias from "../components/chart/chart1";
import PieResumenAcopio from "../components/chart/Pie-resumen-acopio";
import PiePergamino from "../components/chart/PiePergamino";
import Swal from "sweetalert2";
import ProgressBar from "../components/chart/progressoBar";
import { NavBarMovil } from "../components/NavBarMovil";
import RadarCatacion from "../components/chart/RadarCatacion";
import "../styles/Inicio.css";

function Inicio() {
  const URL = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [datosAcopio, setResumenAcopio] = useState([]);
  const [resumenAcopio, setResumen] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [cantidad, setCantidad] = useState([]);
  const [partidas, setPartidas] = useState([]);
  const [partida, setPartida] = useState([]);
  const [catacion, setCatacion] = useState([]);
  const [precio, setPrecio] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [venta, setVenta] = useState([]);
  const [totales, setTotales] = useState("");
  const [muestras, setMuestras] = useState([]);

  const [partidaSeleccionada, setPartidaSeleccionada] = useState(null);

  const { aroma, apreciacion, acidez, cuerpo, sabor, posgusto, balance } =
    catacion;
  const datocatacion = {
    aroma,
    apreciacion,
    acidez,
    cuerpo,
    sabor,
    posgusto,
    balance,
  };

  if (!token) {
    return <Navigate to="/Admin" />;
  }

  const semana = datosAcopio.semana;
  const fechacompra = datosAcopio.fecha
    ? new Date(datosAcopio.fecha).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Sin fecha";

  const ResumenAcopio = async () => {
    try {
      const acopioData = await fetch(`${URL}acopio/total`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      const resumen = await fetch(`${URL}acopio/resumen`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      const datos = await acopioData.json();
      const resData = await resumen.json();
      setResumenAcopio(datos);
      setResumen(resData);
    } catch {}
  };

  const disponibilidadPergamino = async () => {
    try {
      const response = await fetch(`${URL}inventario/disponibilidad`, {
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

      const partidas = await fetch(`${URL}rendimiento/partidas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      const cantidadData = await cantidad.json();
      const data = await response.json();
      const partidaData = await partidas.json();

      setDisponibilidad(data);
      setCantidad(cantidadData);
      setPartidas(partidaData);
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",

        title: "Error en la solicitud",
        text: err.message,
      });
    }
  };

  const getRendimiento = async (partida) => {
    try {
      const partida = await fetch(
        `${URL}rendimiento/partida/${partidaSeleccionada}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        }
      );

      if (!partida.ok) {
        throw new Error("Error en la solicitud");
      }
      const partData = await partida.json();
      setPartida(partData);
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",

        title: "Error en la solicitud",
        text: err.message,
      });
    }
  };

  const obtenerPartida = async () => {
    try {
      const partida = await fetch(
        `${URL}rendimiento/partida/${partidaSeleccionada}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        }
      );
      const catacion = await fetch(
        `${URL}rendimiento/catacion/${partidaSeleccionada}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        }
      );
      const respuesta = await partida.json();
      const catacionRespuesta = await catacion.json();
      setCatacion(catacionRespuesta);
      setPartida(respuesta);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerVentas = async () => {
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
      const totalesmuestra = await fetch(`${URL}muestras/totales`, {
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
      const totalesMuestra = await totalesmuestra.json();

      setVentas(pergaminoData);
      setCantidad(cantidadData);
      setTotales(totalesData);
      setPrecio(precioData);
      setMuestras(totalesMuestra);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    ResumenAcopio();
    disponibilidadPergamino();
    obtenerPartida();
    obtenerVentas();
    const interval = setInterval(() => {}, 5000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (partidas.length > 0) {
      setPartidaSeleccionada(partidas[0].id);
    }
  }, [partidas]);

  useEffect(() => {
    if (partidaSeleccionada) {
      getRendimiento();
      obtenerPartida();
    }
  }, [partidaSeleccionada]);

  const handlePartidaChange = (event) => {
    setPartidaSeleccionada(event.target.value);
  };

  // const total = rtotal.toFixed(2);

  const formatNumber = (number) => {
    return new Intl.NumberFormat("es-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  return (
    <>
      <div className="vista">
        <NavBar />
        <NavBarMovil />
        <Encabezado titulo="Inicio" />
        <div className="grid-container">
          <section className="main">
            <article className="resumen-acpio">
              <h3> Resumen acopio</h3>
              <h4>{fechacompra || "sin fecha"}</h4>
              <div
                className="grafica-pie"
                onClick={() => navigate("/Admin/Acopio/Resumen")}
              >
                <PieResumenAcopio data={resumenAcopio} />
              </div>
              <div className="dato-pesaje">
                <div className="pesajes">
                  <div className="pesaje-dato">
                    <span>Compra</span>
                    <h2>{datosAcopio.compra || 0}</h2>
                    <span>Quintales</span>
                  </div>
                  <div className="pesaje-dato">
                    <span>Consignado</span>
                    <h2>{datosAcopio.consignado || 0} </h2>
                    <span>Quintales</span>
                  </div>
                  <div className="pesaje-dato">
                    <span>Recolectado</span>
                    <h2>{datosAcopio.recolector || 0}</h2>

                    <span>Quintales</span>
                  </div>
                </div>
                <div className="total">
                  <span>
                    <h2>Total</h2>
                  </span>

                  <span>
                    <h2>{datosAcopio.total || 0}</h2>
                    <h5>Quintales</h5>
                  </span>
                </div>
              </div>
            </article>

            <article className="compras">
              <div className="grafica-chart">
                <h6>Compra de los ultimos 6 dias </h6>
                <ChartDias data={semana} />
              </div>
            </article>
          </section>

          <section className="main2">
            <article className="disponibilidadRendimiento">
              <div className="disponibilidad">
                <div className="DatoPergamino">
                  <span>
                    <h3>Disponibilidad</h3>
                  </span>
                  <span>
                    <h2 onClick={() => navigate("/Admin/Inventario")}>
                      {cantidad?.cantidad || 0}
                    </h2>

                    <h5>Quintales</h5>
                  </span>
                </div>
                <div
                  className="piePergamino"
                  onClick={() => navigate("/Admin/Inventario")}
                >
                  <PiePergamino data={disponibilidad} />
                </div>

                {/* <ProgressBar progreso={DisponibilidadP} /> */}
              </div>
              <div className="rendimiento">
                <div className="seleccion">
                  <div className="titulo">
                    <h3>Rendimiento</h3>
                  </div>
                  <select
                    className="selectP"
                    name="partida"
                    id="partida"
                    value={partidaSeleccionada}
                    onChange={handlePartidaChange}
                  >
                    {partidas.map((p, index) => (
                      <option key={index} value={p.id}>
                        Partida #{p.partida} -{" "}
                        {new Date(p.fecha).toLocaleDateString("es-ES")}
                      </option>
                    ))}
                  </select>
                  {/* <p>Opción seleccionada: {selectedOption}</p> */}
                </div>
                <div className="informacion">
                  <div className="datos">
                    <div
                      className="rendimientoP"
                      onClick={() => navigate("/Admin/Inicio/Rendimiento")}
                    >
                      <h2>{partida?.rendimiento || "--"}</h2>
                      <h4>Rendimiento</h4>
                    </div>
                    <div
                      className="maduro"
                      onClick={() => navigate("/Admin/Inicio/Rendimiento")}
                    >
                      <h4>cafe maduro</h4>
                      <h2>{partida?.maduro || "--"} </h2>
                      <h5>Quintales</h5>
                    </div>
                    <div
                      className="pergamino"
                      onClick={() => navigate("/Admin/Inicio/Rendimiento")}
                    >
                      <h4>cafe pergamino</h4>
                      <h2>{partida?.cantidad || "--"}</h2>
                      <h5>Quintales</h5>
                    </div>
                  </div>
                  <div
                    className="Radar"
                    onClick={() => navigate("/Admin/Inicio/Rendimiento")}
                  >
                    <RadarCatacion datos={datocatacion} />
                  </div>
                </div>
              </div>
            </article>

            <article className="ventas">
              <div className="tituloV">
                <h3>Ventas</h3>
                <button onClick={() => navigate("/Admin/Ventas")}>
                  Ver completo
                </button>
              </div>

              <div className="detalle-venta">
                <div className="tabla">
                  <div className="encabezado-venta">
                    <h4>Id</h4>
                    <br />
                    <h4>Fecha</h4>
                    <h4>Cliente</h4>
                    <h4>Peso</h4>
                    <h4>Proceso</h4>
                    <h4>Total</h4>
                  </div>
                  <div className="contenedorV">
                    {ventas.length > 0 ? (
                      ventas.slice(0, 3).map((item, index) => (
                        <div className="venta" key={index}>
                          <h4>{item.id}</h4>
                          <h5>
                            {" "}
                            {new Date(item.fecha).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </h5>
                          <h5> {item.nombre}</h5>
                          <h5>{item.pesoneto} qq</h5>
                          <h5>{item.proceso}</h5>
                          <h5>Q. {formatNumber(item.total)}</h5>
                        </div>
                      ))
                    ) : (
                      <p>No hay datos</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="totales">
                <div className="subtotal">
                  <div className="item">
                    <p>muestras</p>
                    <h2>{muestras?.muestras_enviadas || 0}</h2>
                    <p>Enviadas</p>
                  </div>
                  <div className="contI">
                    <div className="itemV">
                      <p>lavado</p>
                      <h2>{totales?.peso_lavado || 0}</h2>
                      <p>Quintales</p>
                    </div>
                    <div className="itemV">
                      <p>honey</p>
                      <h2>{totales?.peso_honey || 0}</h2>
                      <p>Quintales</p>
                    </div>
                  </div>
                  <div className="contI">
                    <div className="itemV">
                      <p>natural</p>
                      <h2>{totales?.peso_natural || 0}</h2>
                      <p>Quintales</p>
                    </div>
                    <div className="itemV">
                      <p>Subproducto</p>
                      <h2>{totales?.peso_subproducto || 0}</h2>
                      <p>Quintales</p>
                    </div>
                  </div>
                </div>
                <div className="total">
                  <h2>Total</h2>
                  <h3>{totales?.peso_total || 0} qq.</h3>
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
    </>
  );
}
export default Inicio;
