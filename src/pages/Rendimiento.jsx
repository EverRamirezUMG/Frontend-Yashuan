import NavBar from "../components/NavBarDesk";
import Encabezado from "../components/Encabezado";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import ChartDias from "../components/chart/chart1";
import PieResumenAcopio from "../components/chart/Pie-resumen-acopio";
import PiePergamino from "../components/chart/PiePergamino";
import RadarChart from "../components/chart/radar1";
import RadarCatacion from "../components/chart/RadarCatacion";
import IngresarCatacion from "../components/mod/IngresarCatacion";
import "../styles/Rendimiento.css";
// import "../styles/InicioMovil.css";
import ProgressBar from "../components/chart/progressoBar";
import { NavBarMovil } from "../components/NavBarMovil";
import { set } from "react-hook-form";

//Datos simulados de comrpa de cafe maduro

function Rendimiento() {
  const URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const [fecha1, setFecha1] = useState("");
  const [fecha2, setFecha2] = useState("");
  const [partidas, setPartidas] = useState([]);
  const [catacion, setCatacion] = useState([]);
  const [allparitdas, setAllPartidas] = useState([]);
  const [estadoModal1, cambiarEstadoModal1] = useState(false);
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
  const [partida, setPartida] = useState([]);
  const [partidaSeleccionada, setPartidaSeleccionada] = useState();

  if (!token) {
    return <Navigate to="/Admin" />;
  }

  console.log(datocatacion);
  //------------------ CONSULTA DE PARTIDAS ------------ */

  const obtenerPartidas = async () => {
    try {
      const partidas = await fetch(`${URL}rendimiento/partidas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      const allpartidas = await fetch(`${URL}rendimiento/allpartidas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      const respuesta = await partidas.json();
      const allrespuesta = await allpartidas.json();
      setPartidas(respuesta);
      setAllPartidas(allrespuesta);
    } catch (error) {
      console.log(error);
    }
  };

  //---------- OBTENER UNA PARTIDA ESPECIFICA ------------ */

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

  //------------ obtener partodas por rango de feca ------------
  const rangoPartidas = async () => {
    try {
      const response = await fetch(
        `${URL}rendimiento/rangopartidas?fecha1=${encodeURIComponent(
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

      setAllPartidas(data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error en la solicitud",
        text: err.message,
      });
    }
  };

  useEffect(() => {
    obtenerPartidas();
    // obtenerPartida();
  }, []);

  useEffect(() => {
    if (partidaSeleccionada) {
      obtenerPartida();
    }
  }, [partidaSeleccionada]);

  useEffect(() => {
    if (partidas.length > 0) {
      setPartidaSeleccionada(partidas[0].id);
    }
  }, [partidas]);

  //------------------ BUSQUEDA INTELIGENTE------------ */
  const [search, setSearch] = useState("");
  const searcher = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };
  //----metodo de filtrado de busqueda-----
  let result = [];
  if (!search) {
    result = allparitdas;
  } else {
    result = allparitdas.filter(
      (datos) =>
        datos.partida.toString().includes(search) ||
        datos.proceso.toLowerCase().includes(search.toLowerCase())
    );
  }

  //-------- seleccinar partida ---------
  const handlePartidaChange = (event) => {
    setPartidaSeleccionada(event.target.value);
  };

  //------------------ FORMATO DE NUMEROS ------------ */
  const formatNumber = (number) => {
    return new Intl.NumberFormat("es-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const handleCloseModal1 = () => {
    cambiarEstadoModal1(!estadoModal1);
  };

  return (
    <>
      <div className="vista-rendimiento">
        <NavBar />
        <NavBarMovil />
        <Encabezado titulo="Rendimiento" />
        <div className="contenedor-rendimiento">
          <section className="main-1-rendimento">
            <div className="datos-rendimiento">
              <div className="encabezado">
                <h2>Rendimiento</h2>
                <select
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
              </div>
              <div className="dato-rendimiento">
                <div className="contenedor-dato">
                  <div className="dato">
                    <p>Cafe de primera</p>
                    <h3>{partida?.cantidad || 0}</h3>
                    <p>Quintales</p>
                  </div>
                  <div className="dato">
                    <p>Cafe maduro</p>
                    <h3>{partida?.maduro || 0}</h3>
                    <p>Quintales</p>
                  </div>
                </div>
                <div className="rendimiento">
                  <h1>{partida?.rendimiento || 0}</h1>
                  <p>Rendimiento</p>
                </div>
              </div>
              <div className="precio-dia">
                <p>Precio del dia</p>
                <h3>Q. {partida?.precio || 0}</h3>
              </div>
              <div className="datos-fecha">
                <div className="dato">
                  <p>
                    Compra:{" "}
                    {new Date(partida?.fecha).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <div className="dato">
                  <p>
                    Bodega:{" "}
                    {new Date(partida?.fecha_bodega).toLocaleDateString(
                      "es-ES"
                    )}
                  </p>
                </div>
                <div className="dato">
                  <p>Producto: {partida?.proceso}</p>
                </div>
              </div>
            </div>

            <div className="radar">
              <div className="encabezado">
                <h2>Resumen de calidad</h2>
                <div className="puntuacion">
                  {" "}
                  <p>Puntuación</p>
                  <h3>{catacion?.puntuacion}</h3>
                </div>
              </div>

              <div className="botones">
                <IngresarCatacion
                  estado={estadoModal1}
                  cambiarEstado={handleCloseModal1}
                  idpartida={partidaSeleccionada}
                  titulo="Ingresar datos de catación"
                />
                <button
                  type="button"
                  className="btAgregar"
                  onClick={() => cambiarEstadoModal1(!estadoModal1)}
                >
                  Agregar +
                </button>

                {/* <button className="btEditar">
                  <span className="material-symbols-outlined">edit</span>
                </button> */}
              </div>
              <RadarCatacion datos={datocatacion} />
              <div className="notas">
                <div className="nota">
                  <p>Aroma: </p> <h4> {catacion?.aroma}</h4>
                </div>
                <div className="nota">
                  <p>Sabor: </p> <h4> {catacion?.sabor}</h4>
                </div>
                <div className="nota">
                  <p>Posgusto: </p> <h4> {catacion?.posgusto}</h4>
                </div>
                <div className="nota">
                  <p>Acidez: </p> <h4> {catacion?.acidez}</h4>
                </div>
                <div className="nota">
                  <p>Cuerpo: </p> <h4> {catacion?.cuerpo}</h4>
                </div>
                <div className="nota">
                  <p>Balance: </p> <h4> {catacion?.balance}</h4>
                </div>
                <div className="nota">
                  <p>Apreciacion: </p> <h4> {catacion?.apreciacion}</h4>
                </div>
              </div>
            </div>
          </section>
          <section className="main-2-partida">
            <h3>Partidas ingresadas</h3>
            <div className="titulo">
              <div className="Rango-fecha">
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
                <button type="button" onClick={rangoPartidas}>
                  Aceptar
                </button>
              </div>
              <div className="buscador">
                <input
                  type="text"
                  placeholder="Buscar partida o proceso"
                  onChange={searcher}
                />
                <button>
                  <span className="material-symbols-outlined">search</span>
                </button>
              </div>
            </div>

            <div className="tabla">
              <div className="encabezado">
                <span className="productor">Partida</span>
                <span>Proceso</span>
                <span>Cantidad</span>
                <span>Fecha ingreso en bodega</span>
                <span>Maduro</span>
              </div>
              <div className="datos">
                {result.length > 0 ? (
                  result.map((item, index) => (
                    <div className="dato" key={index}>
                      <span className="productor">
                        Partida <h3> #{item.partida}</h3> -{" "}
                        {new Date(item.fecha).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span>{item.proceso}</span>
                      <span>qq {formatNumber(item.cantidad)}</span>
                      <span>
                        {" "}
                        {new Date(item.fecha).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span>{item.maduro}</span>
                      {/* <span>{item.observacion}</span> */}
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
      </div>
    </>
  );
}
export default Rendimiento;
