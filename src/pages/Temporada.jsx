import NavBar from "../components/NavBarDesk";
import Encabezado from "../components/Encabezado";
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

//Datos simulados de comrpa de cafe maduro
const DatosC = {
  acopio: 37.83,
  productor: 3.9,
  socio: 2.4,
  recolectado: 102.91,
};

//datos simulados de compra semanal
const SemanaD = {
  lunes: 10,
  martes: 20,
  miercoles: 30,
  jueves: 40,
  viernes: 50,
  sabado: 60,
};

//Datos simulados de disponibilidad de cafe pergamino
const pergamino = {
  Lavado: 75.3,
  Honey: 24,
  Natural: 12,
  Subproducto: 5,
};

function Temporada() {
  const [content, setContent] = useState("");
  const URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(URL + "home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContent(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchData();
  }, [token]);

  if (!token) {
    return <Navigate to="/Admin" />;
  }

  //sumatoria de datos para calcular total de cafe comprado
  let productor = DatosC.productor;
  let socio = DatosC.socio;
  let recolectado = DatosC.recolectado;
  let acopio = DatosC.acopio;

  let consignado = productor + socio;

  let rtotal = acopio + consignado + recolectado;

  //sumatoria de datos para cantidad de cafe pergamino disponible
  let lavado = pergamino.Lavado;
  let honey = pergamino.Honey;
  let natural = pergamino.Natural;
  let subproducto = pergamino.Subproducto;

  let DisponibilidadP = lavado + honey + natural + subproducto;

  const total = rtotal.toFixed(2);

  return (
    <>
      <div className="vista">
        <NavBar />
        <NavBarMovil />
        <Encabezado titulo="Resumen de temporada" />
        <div className="grid-container">
          <section className="main">
            <article className="resumen-acpio">
              <h3> Resumen acopio</h3>
              <h4>{content}</h4>
              <div className="grafica-pie">
                <PieResumenAcopio data={DatosC} />
              </div>
              <div className="dato-pesaje">
                <div className="pesajes">
                  <div className="pesaje-dato">
                    <span>Compra</span>
                    <h2>{acopio}</h2>
                    <span>Quintales</span>
                  </div>
                  <div className="pesaje-dato">
                    <span>Consignado</span>
                    <h2>{consignado} </h2>
                    <span>Quintales</span>
                  </div>
                  <div className="pesaje-dato">
                    <span>Recolectado</span>
                    <h2>{recolectado}</h2>
                    <span>Quintales</span>
                  </div>
                </div>
                <div className="total">
                  <span>
                    <h2>Total</h2>
                  </span>

                  <span>
                    <h2>{total}</h2>
                    <h5>Quintales</h5>
                  </span>
                </div>
              </div>
            </article>

            <article className="compras">
              <div className="grafica-chart">
                <h6>Compra de los ultimos 6 dias </h6>
                <ChartDias data={SemanaD} />
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
export default Temporada;
