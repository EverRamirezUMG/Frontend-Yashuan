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
import "../styles/Productores.css";

function Productores() {
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
  const [idcomprobante, setIdcomprobante] = useState("");
  console.log(compra);

  if (!token) {
    return <Navigate to="/Admin" />;
  }

  //--------------- obtencion de lista de compras realizadas ----------------
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

  //----------------------- PAGO DE CONSIGANCION -----------------------

  const PagarConsignado = async () => {
    try {
      const response = await fetch(`${URL}productores/pagar/${idcomprobante}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
    } catch (err) {
      console.error(err);
    }
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

      const datos = await response.json();

      setCompra(datos); // Verifica la estructura aquí
    } catch (err) {
      console.error(err);
    }
  };

  const resumen_acopio = async () => {
    try {
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

      const resResumen = await resumenAcopio.json();
      setResumen(resResumen);
    } catch (err) {
      console.error(err);
    }
  };
  const resumen_total = async () => {
    try {
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
      const resTotal = await resumenTotal.json();

      setResumenAcopio(resTotal);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    compras();
    ResumenAcopio();
    resumen_acopio();
    resumen_total();
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
    if (idcomprobante) {
      PagarConsignado();
      compras();
      ResumenAcopio();
      resumen_acopio();
      resumen_total();
      rangoCompras();
      setIdcomprobante("");
      setCompraSeleccionada(false);
    }
  }, [idcomprobante]);

  useEffect(() => {
    if (compraSeleccionada) {
      setFecha2("");
      setFecha1("");
      PagarConsignado();
      resumen_acopio();
      resumen_total();
      compras();
      setIdcomprobante();
    }
  }, [compraSeleccionada]);

  //--------------- verificacion de encargados ----------------
  const encargado = Array.isArray(datosAcopio.encargado)
    ? datosAcopio.encargado.map((p) => p.usuario).join(", ")
    : datosAcopio.encargado;
  return (
    <>
      <div className="vista-productores">
        <NavBar />
        <NavBarMovil />
        <Encabezado titulo="Productores" />
        <div className="container-productores">
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
              <div className="main-encabezado-p">
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
                  <select
                    name="compras"
                    id="compras"
                    onChange={handleCompraChange}
                  >
                    <option value="">Ultima compra</option>
                    {listaCompra.map((compra, index) => (
                      <option key={index} value={compra.idcompra}>
                        {new Date(compra.fecha).toLocaleDateString("es-ES", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </option>
                    ))}
                  </select>
                  <button onClick={compras}>Cargar</button>
                </div>
                <div className="Rango-fecha2">
                  <ExcelGenerator data={result} head={datosAcopio} />
                  <GenerarReporte data={result} head={datosAcopio} />
                </div>
              </div>
              <div className="main-datos">
                <section className="main-compras">
                  <div className="totalcompra">
                    <h2>Productores:</h2>
                  </div>
                  <div className="tabla">
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
                    </div>
                    <div className="encabezado">
                      <span>Codigo</span>
                      <span className="productor">Productor</span>
                      <span>Tipo</span>
                      <span>Fecha</span>
                      <span>Peso neto</span>
                      <span>Flete</span>
                      <span>Costo</span>
                      <span>Consignar</span>
                      <span>Comprobante</span>
                      <span>Pago</span>
                      <span>Acciones</span>
                    </div>
                    <div className="datos">
                      {result.length > 0 ? (
                        result.map((item, index) => (
                          <div className="dato" key={index}>
                            <span>{item.pk_productor}</span>
                            <span className="productor">{item.nombre}</span>
                            <span>{item.tipo}</span>
                            <span>
                              {new Date(item.fecha).toLocaleDateString("es-ES")}
                            </span>
                            <span>{item.pesoneto}</span>
                            <span>
                              Q. {Number(item.flete).toLocaleString()}
                            </span>
                            <span>
                              Q. {Number(item.total).toLocaleString()}
                            </span>
                            <span>{item.consignar ? "Consignado" : "No"}</span>
                            <span>{item.pk_comprobante}</span>
                            <span>Q. {Number(item.pago).toLocaleString()}</span>
                            <div className="botones">
                              {item.pago != 0 ? (
                                <h3 className="pagado">Pagado</h3>
                              ) : (
                                <button
                                  onClick={async () => {
                                    setIdcomprobante(item.pk_comprobante);
                                  }}
                                  className="btPagar"
                                >
                                  {" "}
                                  Pagar{" "}
                                </button>
                              )}
                              {/* 
                              <button className="editar">
                                <span className="material-symbols-outlined">
                                  edit
                                </span>
                              </button>
                              <button className="eliminar">
                                <span className="material-symbols-outlined">
                                  delete
                                </span>
                              </button> */}
                            </div>
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
export default Productores;
