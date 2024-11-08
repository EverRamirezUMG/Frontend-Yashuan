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
import "../styles/Resumen.css";

function Resumen() {
  const [content, setContent] = useState("");
  const URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const [datosAcopio, setResumenAcopio] = useState([]);
  const [resumenAcopio, setResumen] = useState([]);
  const [compra, setCompra] = useState([]);
  const [listaCompra, setListaCompra] = useState([]);
  const [compraSeleccionada, setCompraSeleccionada] = useState(false);
  const [fecha1, setFecha1] = useState("");
  const [fecha2, setFecha2] = useState("");
  console.log(compra);

  if (!token) {
    return <Navigate to="/Admin" />;
  }

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
      const compra = await fetch(`${URL}resumen/lista`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });

      const resCompra = await compra.json();

      setListaCompra(resCompra);
    } catch {}
  };

  //--------------------- capturar los compras ---------------------
  const compras = async () => {
    try {
      const response = await fetch(
        URL +
          `resumen/compra?idcompra=${encodeURIComponent(compraSeleccionada)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        }
      );
      const resumenAcopio = await fetch(
        URL +
          `resumen/resumenid?idcompra=${encodeURIComponent(
            compraSeleccionada
          )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        }
      );
      const resumenTotal = await fetch(
        URL +
          `resumen/totalid?idcompra=${encodeURIComponent(compraSeleccionada)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        }
      );

      const datos = await response.json();
      const resResumen = await resumenAcopio.json();
      const resTotal = await resumenTotal.json();

      setCompra(datos); // Verifica la estructura aquí
      setResumen(resResumen);
      setResumenAcopio(resTotal);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    compras();
    ResumenAcopio();
  }, []);

  //--------------------- COMPRA POR RANGO DE FECHA ---------------------
  const rangoCompras = async () => {
    try {
      const response = await fetch(
        `${URL}resumen/compras?fecha1=${encodeURIComponent(
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

      const resumen = await fetch(
        `${URL}resumen/resumen?fecha1=${encodeURIComponent(
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

      const total = await fetch(
        `${URL}resumen/total?fecha1=${encodeURIComponent(
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
      const resResumen = await resumen.json();
      const resTotal = await total.json();
      setCompra(data);
      setResumen(resResumen);
      setResumenAcopio(resTotal);
    } catch (err) {
      console.error(err);

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
  //----metodod de filtrado de busqueda-----
  let result = [];
  if (!search) {
    result = compra;
  } else {
    result = compra.filter((datos) =>
      datos.nombre.toLowerCase().includes(search.toLowerCase())
    );
  }

  //------------------- ESCUCHAR DATOS EN TIEMPO REAL ---------------------
  useEffect(() => {
    ResumenAcopio();
    const interval = setInterval(() => {
      ResumenAcopio();
    }, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const formatNumber = (number) => {
    return new Intl.NumberFormat("es-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const handleCompraChange = (event) => {
    const selectedValue = event.target.value;
    // Convierte el valor a false si es el valor vacío
    setCompraSeleccionada(selectedValue === "" ? false : selectedValue);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await compras();
      await ResumenAcopio();
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (compraSeleccionada) {
      compras();
    }
  }, [compraSeleccionada]);

  //--------------- verificacion de encargados ----------------
  const encargado = Array.isArray(datosAcopio.encargado)
    ? datosAcopio.encargado.map((p) => p.usuario).join(", ")
    : datosAcopio.encargado;
  return (
    <>
      <div className="vista-resumen">
        <NavBar />
        <NavBarMovil />
        <Encabezado titulo="Resumen acopio" />
        <div className="container-resumen">
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
              <div className="main-encabezado">
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
                  <button type="button" onClick={rangoCompras}>
                    Aceptar
                  </button>
                </div>
                <div className="Rango-fecha2">
                  <p>Seleccionar por: </p>
                  <select
                    name="compras"
                    id="compras"
                    onChange={handleCompraChange}
                  >
                    {listaCompra.map((compra, index) => (
                      <option key={index} value={compra.idcompra}>
                        Partida #{compra?.partida || "N/A"}
                        {" - "}
                        {new Date(compra.fecha).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="Rango-fecha2">
                  <p>Encargado:</p>
                  <h3>{encargado || 0}</h3>
                </div>
              </div>
              <div className="main-datos">
                <section className="main-acopio">
                  <article className="resumen-acpio">
                    <h3> Resumen acopio</h3>
                    <h4>{fechacompra || "sin fecha"}</h4>
                    <div className="grafica-pie">
                      <PieResumenAcopio data={resumenAcopio} />
                    </div>
                    <div className="dato-pesaje">
                      <div>
                        <div className="indicadores">
                          <p>Compras realizadas</p>
                          <h3>{datosAcopio.compras || 0}</h3>
                        </div>
                        <div className="indicadores">
                          <p>Productores atendidos</p>
                          <h3>{datosAcopio.productores || 0}</h3>
                        </div>
                        <div className="indicadores">
                          <p>Costo estimado: </p>
                          <h3> Q. {formatNumber(datosAcopio.costo) || 0}</h3>
                        </div>
                        <div className="indicadores">
                          <p>Costo real: </p>
                          <h3> Q. {formatNumber(datosAcopio.pago) || 0}</h3>
                        </div>
                      </div>
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
                          <h2>{formatNumber(datosAcopio.total) || 0}</h2>
                          <h5>Quintales</h5>
                        </span>
                      </div>
                    </div>
                  </article>
                </section>
                <section className="main-compras">
                  <div className="titulo">
                    <h3>Compras realizadas</h3>
                    <div className="buscador">
                      <input
                        type="text"
                        placeholder="Buscar productor"
                        onChange={searcher}
                      />
                      <button>
                        <span className="material-symbols-outlined">
                          search
                        </span>
                      </button>
                    </div>
                    <ExcelGenerator data={compra} head={datosAcopio} />
                    <GenerarReporte data={compra} head={datosAcopio} />
                  </div>

                  <div className="tabla">
                    <div className="encabezado">
                      <span className="productor">Productor</span>
                      <span>Peso bruto</span>
                      <span>Tara</span>
                      <span>Peso neto</span>
                      <span>Costo</span>
                      <span>Pago</span>
                    </div>
                    <div className="datos">
                      {result.length > 0 ? (
                        result.map((item, index) => (
                          <div className="dato" key={index}>
                            <span className="productor">{item.nombre}</span>
                            <span>{item.pesobruto}</span>
                            <span>{item.tara}</span>
                            <span>{item.pesoneto}</span>
                            <span>
                              Q. {Number(item.total).toLocaleString()}
                            </span>
                            <span>Q. {Number(item.pago).toLocaleString()}</span>
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
                    {/* <div className="totalcompra">
                      <h2>Total:</h2>
                    </div> */}
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
export default Resumen;
