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
import "../styles/Inventario.css";
import { set } from "react-hook-form";
import ProgressBar from "../components/ProgressBar";
import PiePergamino from "../components/chart/PiePergamino";

function Inventario() {
  const URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [fecha1, setFecha1] = useState("");
  const [fecha2, setFecha2] = useState("");
  const [peso, setPeso] = useState(0);
  const [tara, setTara] = useState(0);
  const [filas, setFilas] = useState([]);
  const [partida, setPartidas] = useState([]);
  const [proceso, setProcesos] = useState([]);
  const [pergamino, setPergamino] = useState([]);
  const [cantidad, setCantidad] = useState([]);
  const [partidaSeleccionada, setPartidaSeleccionada] = useState(null);
  const [procesoSeleccionado, setProcesoSeleccionado] = useState(null);

  const [observacion, setObservacion] = useState("");

  if (!token) {
    return <Navigate to="/Admin" />;
  }

  const datos = async () => {
    try {
      const partidas = await fetch(`${URL}inventario/partidas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      const procesos = await fetch(`${URL}inventario/proceso`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      const pergamino = await fetch(`${URL}inventario/pergamino`, {
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

      if (!partidas.ok) {
        throw new Error("Error en la solicitud");
      }

      const partidaDara = await partidas.json();
      const procesosData = await procesos.json();
      const pergaminoData = await pergamino.json();
      const cantidadData = await cantidad.json();
      setPartidas(partidaDara);
      setProcesos(procesosData);
      setPergamino(pergaminoData);
      setCantidad(cantidadData);
    } catch (err) {
      console.error(err);
    }
  };

  //--------------- CALCULAR TOTALES DE CAFE PERGAMINO INGRESADO ----------------
  const agregarFila = () => {
    if (!peso || peso < 1) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe ingresar un peso valido.",
      });

      return;
    }
    if (tara < 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La tara no puede ser menor que 0.",
      });

      return;
    }
    const pesoNeto = peso - (tara || 0);
    const nuevaFila = {
      pesoBruto: peso,
      tara: tara || 0,
      pesoNeto: pesoNeto,
    };
    setFilas([...filas, nuevaFila]);
    setPeso(null);
    setTara(null);
  };

  const totalBruto = filas.reduce((acc, fila) => acc + fila.pesoBruto, 0) / 100;
  const totalTara = filas.reduce((acc, fila) => acc + fila.tara, 0) / 100;
  const totalNeto = filas.reduce((acc, fila) => acc + fila.pesoNeto, 0) / 100;

  console.log(partidaSeleccionada);
  console.log(procesoSeleccionado);
  console.log(totalBruto);
  console.log(totalTara);
  console.log(observacion);

  //--------------- INGRESO DE CAFE PERGAMINO A BODEGA ----------------
  const ingresarPergamino = async () => {
    try {
      const response = await fetch(`${URL}inventario/ingresar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
        body: JSON.stringify({
          idpartida: partidaSeleccionada,
          peso_bruto: totalBruto,
          tara: totalTara,
          proceso: procesoSeleccionado,
          observacion: observacion,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();
      console.log(data);
      Swal.fire({
        icon: "success",
        title: "Ingreso de café pergamino",
        text: "El café pergamino ha sido ingresado correctamente.",
      });
      setFilas([]);
      setObservacion(" ");
      disponibilidadPergamino();
      datos();
      setProcesoSeleccionado(null);
      setPartidaSeleccionada(null);
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Error en la solicitud",
        text: err.message,
      });
      datos();
    }
  };

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
        `${URL}inventario/pergaminos?fecha1=${encodeURIComponent(
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

      setPergamino(data);
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
    result = pergamino;
  } else {
    result = pergamino.filter(
      (datos) =>
        datos.partida.toString().includes(search) ||
        datos.proceso.toLowerCase().includes(search.toLowerCase())
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

  //---------------- observaciones ----------------
  const handlesetObservacion = (event) => {
    setObservacion(event.target.value); // Actualiza el estado con el valor del input
  };
  //---------------------- eliminar fila ----------------

  const eliminarFila = (index) => {
    const nuevasFilas = filas.filter((_, i) => i !== index);
    setFilas(nuevasFilas);
  };

  //-------- seleccinar partida ---------
  const handlePartidaChange = (event) => {
    setPartidaSeleccionada(event.target.value);
  };

  const handleProcesoChange = (event) => {
    setProcesoSeleccionado(event.target.value);
  };

  return (
    <>
      <div className="vista-inventario">
        <NavBar />
        <NavBarMovil />
        <Encabezado titulo="Inventario" />
        <div className="container-inventario">
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
                <article className="grafica-disponibilidad">
                  <div className="titulo">
                    <div className="subtitulo">
                      <h4> Disponibilidad</h4>
                    </div>
                    <div className="subtitulo">
                      <h3>{cantidad?.cantidad}</h3>
                      <p>Quintales</p>
                    </div>
                  </div>
                  <div className="grafica-pie">
                    {/* <PieResumenAcopio data={disponibilidad} /> */}
                    <PiePergamino data={disponibilidad} />
                  </div>
                  <ProgressBar capacidad={1200} progreso={cantidad?.cantidad} />
                </article>

                <section className="ingreso-pergamino">
                  <div className="datoProductor">
                    <h4>Ingreso de permagino</h4>
                    <div className="datos">
                      <div className="dato">
                        <div className="botones">
                          <select
                            name="partida"
                            id="partida"
                            value={partidaSeleccionada}
                            onChange={handlePartidaChange}
                          >
                            <option value={null}>Seleccione una partida</option>
                            {partida.map((p, index) => (
                              <option key={index} value={p.id}>
                                Partida #{p.partida} -{" "}
                                {new Date(p.fecha).toLocaleDateString("es-ES")}
                              </option>
                            ))}
                          </select>

                          <select
                            name="Proceso"
                            id="Proceso"
                            value={procesoSeleccionado}
                            onChange={handleProcesoChange}
                          >
                            <option value={null}>Seleccione un proceso</option>
                            {proceso.map((p, index) => (
                              <option key={index} value={p.id}>
                                {p.proceso}
                              </option>
                            ))}
                          </select>
                          <button onClick={() => ingresarPergamino()}>
                            Guardar
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="pesaje">
                      <div className="datopesaje">
                        <div className="datoP">
                          <p>Peso</p>
                          <input
                            type="number"
                            value={peso || ""}
                            onChange={(e) => {
                              const value = e.target.value
                                ? Number(e.target.value)
                                : 0;
                              if (value < 1) {
                                Swal.fire({
                                  icon: "error",
                                  title: "Error",
                                  text: "Debe ingresar un valor válido para el peso.",
                                });
                              }
                              setPeso(value);
                            }}
                            placeholder="Libras"
                          />
                        </div>
                        <div className="datoP">
                          <p>Tara</p>
                          <input
                            type="number"
                            value={tara || ""}
                            onChange={(e) => {
                              const value = e.target.value
                                ? Number(e.target.value)
                                : 0;
                              if (value < 1) {
                                Swal.fire({
                                  icon: "error",
                                  title: "Error",
                                  text: "Debe ingresar un valor válido para la tara.",
                                });
                              }
                              setTara(value);
                            }}
                            placeholder="Bultos"
                          />
                        </div>
                        <button className="borrar" onClick={() => setFilas([])}>
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </button>

                        <button className="agregar" onClick={agregarFila}>
                          Agregar
                        </button>
                      </div>

                      <div className="encabezado">
                        <span>No.</span>
                        <span>Peso bruto</span>
                        <span>Tara</span>
                        <span>Peso neto</span>
                        <span>Acción</span>
                      </div>

                      <div className="pesajesD">
                        {filas.map((fila, index) => (
                          <div className="datoP" key={index}>
                            <span>{index + 1}</span>
                            <span>{fila.pesoBruto / 100}</span>
                            <span>{fila.tara}</span>
                            <span>{fila.pesoNeto / 100}</span>
                            <button
                              className="eliminar"
                              onClick={() => eliminarFila(index)}
                            >
                              <span className="material-symbols-outlined">
                                delete
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="totalesP">
                        <span>Total</span>
                        <span>{totalBruto}</span>
                        <span>{(totalTara * 100).toFixed(0)}</span>
                        <span>{totalNeto}</span>
                        <span></span>
                      </div>
                    </div>

                    <div className="totales">
                      <div className="observacion">
                        <input
                          type="text"
                          value={observacion}
                          onChange={handlesetObservacion}
                          placeholder="Observaciones"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <div className="main-datos">
                <section className="main-pergamino">
                  <div className="titulo">
                    <h3>Partidas ingresadas</h3>
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
                      <button type="button" onClick={rangoPergamino}>
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
                        <span className="material-symbols-outlined">
                          search
                        </span>
                      </button>
                    </div>

                    <div className="Rango-fecha2">
                      {/* <ExcelGenerator data={pergamino} head={""} /> */}
                      <GenerarReporte data={pergamino} head={""} />
                    </div>
                  </div>

                  <div className="tabla">
                    <div className="encabezado">
                      <span className="productor">Partida</span>
                      <span>Proceso</span>
                      <span>Cantidad</span>
                      <span>Fecha ingreso en bodega</span>
                      <span>Observacion</span>
                    </div>
                    <div className="datos-pergaminoT">
                      {result.length > 0 ? (
                        result.map((item, index) => (
                          <div className="datoPerg" key={index}>
                            <span className="productor">
                              Partida <h3> #{item.partida}</h3> -{" "}
                              {new Date(item.fecha).toLocaleDateString(
                                "es-ES",
                                { year: "numeric" }
                              )}
                            </span>
                            <span>{item.proceso}</span>
                            <span>qq {formatNumber(item.cantidad)}</span>
                            <span>
                              {" "}
                              {new Date(item.fecha).toLocaleDateString(
                                "es-ES",
                                {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </span>

                            <span>{item.observacion}</span>
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
export default Inventario;
