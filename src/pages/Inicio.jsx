import { Encabezado, NavBar } from "../components";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import ChartDias from "../components/chart/chart1";
import PieResumenAcopio from "../components/chart/Pie-resumen-acopio";
import PiePergamino from "../components/chart/PiePergamino";
import RadarChart from "../components/chart/radar1";
import "../styles/Inicio.css";
import Swal from "sweetalert2";
// import "../styles/InicioMovil.css";
import ProgressBar from "../components/chart/progressoBar";
import { NavBarMovil } from "../components/NavBarMovil";

function Inicio() {
  const [content, setContent] = useState("");
  const URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const [datosAcopio, setResumenAcopio] = useState([]);
  const [resumenAcopio, setResumen] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [cantidad, setCantidad] = useState([]);
  const [partidas, setPartidas] = useState([]);
  const [partida, setPartida] = useState([]);
  const [partidaSeleccionada, setPartidaSeleccionada] = useState(null);

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

      const partidas = await fetch(`${URL}inventario/partidas`, {
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
        `${URL}inventario/partida/${partidaSeleccionada}`,
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

  useEffect(() => {
    ResumenAcopio();
    disponibilidadPergamino();
    const interval = setInterval(() => {
      ResumenAcopio();
    }, 5000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (partidaSeleccionada) {
      getRendimiento();
    }
  }, [partidaSeleccionada]);

  const handlePartidaChange = (event) => {
    setPartidaSeleccionada(event.target.value);
  };

  // const total = rtotal.toFixed(2);

  console.log(partida[0]);

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
              <div className="grafica-pie">
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
                    <h2>{cantidad?.cantidad}</h2>

                    <h5>Quintales</h5>
                  </span>
                </div>
                <div className="piePergamino">
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
                    <option value={null}>Seleccione una partida</option>
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
                    <div className="rendimientoP">
                      <h2>{partida[0]?.rendimiento || "--"}</h2>
                      <h4>Rendimiento</h4>
                    </div>
                    <div className="maduro">
                      <h4>cafe maduro</h4>
                      <h2>{partida[0]?.maduro || "--"} </h2>
                      <h5>Quintales</h5>
                    </div>
                    <div className="pergamino">
                      <h4>cafe pergamino</h4>
                      <h2>{partida[0]?.pergamino || "--"}</h2>
                      <h5>Quintales</h5>
                    </div>
                  </div>
                  <div className="Radar">
                    <RadarChart />
                  </div>
                </div>
              </div>
            </article>

            <article className="ventas">
              <div className="tituloV">
                <h3>Resumen de ventas </h3>
                <button> Ver completo</button>
              </div>

              <div className="detalle-venta">
                <div className="contenedorV">
                  <div className="venta">
                    <h4>venta #1</h4>
                    <h5>fecha</h5>
                    <h5>cliente</h5>
                    <h5>cantidad</h5>
                    <h5>total</h5>
                  </div>
                  <div className="venta">
                    <h4>venta #2</h4>
                    <h5>fecha</h5>
                    <h5>cliente</h5>
                    <h5>cantidad</h5>
                    <h5>total</h5>
                  </div>
                  <div className="venta">
                    <h4>venta #3</h4>
                    <h5>fecha</h5>
                    <h5>cliente</h5>
                    <h5>cantidad</h5>
                    <h5>total</h5>
                  </div>
                  <div className="venta">
                    <h4>venta #4</h4>
                    <h5>fecha</h5>
                    <h5>cliente</h5>
                    <h5>cantidad</h5>
                    <h5>total</h5>
                  </div>
                </div>
              </div>
              <div className="totales">
                <div className="subtotal">
                  <div className="item">
                    <p>muestras</p>
                    <h2>15.2</h2>
                    <p>Enviadas</p>
                  </div>
                  <div className="contI">
                    <div className="itemV">
                      <p>lavado</p>
                      <h2>15.2</h2>
                      <p>Quintales</p>
                    </div>
                    <div className="itemV">
                      <p>honey</p>
                      <h2>15.2</h2>
                      <p>Quintales</p>
                    </div>
                  </div>
                  <div className="contI">
                    <div className="itemV">
                      <p>natural</p>
                      <h2>15.2</h2>
                      <p>Quintales</p>
                    </div>
                    <div className="itemV">
                      <p>Subproducto</p>
                      <h2>15.2</h2>
                      <p>Quintales</p>
                    </div>
                  </div>
                </div>
                <div className="total">
                  <h2>Total</h2>
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
