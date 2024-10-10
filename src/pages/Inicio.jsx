import { Encabezado, NavBar } from "../components";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import ChartDias from "../components/chart/chart1";
import PieResumenAcopio from "../components/chart/Pie-resumen-acopio";
import PiePergamino from "../components/chart/PiePergamino";
import RadarChart from "../components/chart/radar1";
import "../styles/Inicio.css";
// import "../styles/InicioMovil.css";
import ProgressBar from "../components/chart/progressoBar";
import { NavBarMovil } from "../components/NavBarMovil";

//Datos simulados de disponibilidad de cafe pergamino
const pergamino = {
  Lavado: 75.3,
  Honey: 24,
  Natural: 12,
  Subproducto: 5,
};

function Inicio() {
  const [content, setContent] = useState("");
  const URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const [datosAcopio, setResumenAcopio] = useState([]);
  const [resumenAcopio, setResumen] = useState([]);

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

  console.log(semana);
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
      console.log(datos);
    } catch {}
  };

  useEffect(() => {
    ResumenAcopio();
    const interval = setInterval(() => {
      ResumenAcopio();
    }, 5000);
    return () => clearInterval(interval);
  }, [token]);

  //sumatoria de datos para calcular total de cafe comprado
  let productor = datosAcopio.productor;
  let socio = datosAcopio.socio;
  let recolectado = datosAcopio.recolector;
  let acopio = datosAcopio.compra;

  let consignado = datosAcopio.consignado;

  let rtotal = acopio + consignado + recolectado;

  //sumatoria de datos para cantidad de cafe pergamino disponible
  let lavado = pergamino.Lavado;
  let honey = pergamino.Honey;
  let natural = pergamino.Natural;
  let subproducto = pergamino.Subproducto;

  let DisponibilidadP = lavado + honey + natural + subproducto;

  // const total = rtotal.toFixed(2);

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
                    <h2>{DisponibilidadP}</h2>

                    <h5>Quintales</h5>
                  </span>
                </div>
                <div className="piePergamino">
                  <PiePergamino data={pergamino} />
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
                    name="rendimiento"
                    id="rendimiento"
                    // value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  >
                    <option value="opcion1">Partida #35</option>
                    <option value="opcion2">Opción 2</option>
                    <option value="opcion3">Opción 3</option>
                  </select>
                  {/* <p>Opción seleccionada: {selectedOption}</p> */}
                </div>
                <div className="informacion">
                  <div className="datos">
                    <div className="rendimientoP">
                      <h2>4.6676</h2>
                      <h4>Rendimiento</h4>
                    </div>
                    <div className="maduro">
                      <h4>cafe maduro</h4>
                      <h2>33.14 </h2>
                      <h5>Quintales</h5>
                    </div>
                    <div className="pergamino">
                      <h4>cafe pergamino</h4>
                      <h2>7.10</h2>
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
