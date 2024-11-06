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
import "../styles/Productores.css";

function CostoProduccion() {
  const URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const [costosProduccion, setCostosProduccion] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [procesoSeleccionado, setProcesoSeleccionado] = useState(1);
  const [gasto_beneficio, setGastoBeneficio] = useState([]);

  console.log(procesoSeleccionado);

  if (!token) {
    return <Navigate to="/Admin" />;
  }

  //-----------  OBTENCION DE COSTOS DE PRODUCCION ----------------

  const costosdeProduccion = async () => {
    try {
      const response = await fetch(
        `${URL}costoproduccion/${procesoSeleccionado}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        }
      );
      const resumen = await response.json();
      setCostosProduccion(resumen);
    } catch (err) {
      console.error(err);
    }
  };

  //--------------- obtencion de gasto beneficio ----------------
  const gastoBeneficio = async () => {
    try {
      const response = await fetch(`${URL}costoproduccion/beneficio`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });

      const gasto = await response.json();
      setGastoBeneficio(gasto);
    } catch (err) {
      console.error(err);
    }
  };

  //--------------- obtencion de lista de compras realizadas ----------------

  const obtenerprocesos = async () => {
    try {
      const response = await fetch(`${URL}inventario/proceso`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });

      const resumen = await response.json();
      setProcesos(resumen);
    } catch (err) {
      console.error(err);
    }
  };

  //----------------------- PAGO DE CONSIGANCION -----------------------

  useEffect(() => {
    costosdeProduccion();
    obtenerprocesos();
    gastoBeneficio();
  }, []);

  //--------------------- COMPRA POR RANGO DE FECHA ---------------------

  //------------------ BUSQUEDA INTELIGENTE------------ */
  const [search, setSearch] = useState("");
  const searcher = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };
  //----metodod de filtrado de busqueda-----
  let result = [];
  if (!search) {
    result = costosProduccion;
  } else {
    result = costosProduccion.filter((datos) =>
      typeof datos.partida === "number"
        ? datos.partida.toString().includes(search)
        : datos.partida.toLowerCase().includes(search.toLowerCase())
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

  const handleProcesoChange = (event) => {
    const selectedValue = event.target.value;
    // Convierte el valor a false si es el valor vacío
    setProcesoSeleccionado(selectedValue === "" ? false : selectedValue);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await costosdeProduccion();

      setLoading(false);
    };

    fetchData();
  }, []);

  //----------- cargar costo de produccion al seleccionar un proceso ----------------

  useEffect(() => {
    if (procesoSeleccionado) {
      costosdeProduccion();
    }
  }, [procesoSeleccionado]);

  return (
    <>
      <div className="vista-productores">
        <NavBar />
        <NavBarMovil />
        <Encabezado titulo="Costo de producción" />
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
                  <p>Gasto beneficio:</p>
                  {/* <input
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
                  /> */}
                  <span className="calendario-b">
                    {gasto_beneficio?.beneficio}
                  </span>
                  <p>Otros gastos</p>
                  <span className="calendario-b">{gasto_beneficio?.otros}</span>
                  {/* <input
                    type="date"
                    className="calendario-b"
                    min={fecha1}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setFecha2(e.target.value)}
                    value={fecha2}
                  /> */}
                  <button type="button" onClick={""}>
                    Aceptar
                  </button>
                </div>
                <div className="Rango-fecha2">
                  <select
                    name="proceso"
                    id="proceso"
                    value={procesoSeleccionado}
                    onChange={handleProcesoChange}
                  >
                    {procesos.map((proceso, index) => (
                      <option key={index} value={proceso.id}>
                        {proceso.proceso}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="Rango-fecha2">
                  <ExcelGenerator data={""} head={""} />
                  <GenerarReporte data={""} head={""} />
                </div>
              </div>
              <div className="main-datos">
                <section className="main-compras">
                  <div className="totalcompra"></div>
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
                      <span>Partida</span>
                      <span className="productor">Ingreso en bodega</span>
                      <span>Proceso</span>
                      <span>Primera</span>
                      <span>Precio maduro</span>
                      <span>Cantidad maduro</span>
                      <span>Rendimiento</span>
                      <span>Total maduro</span>
                      <span>Beneficio</span>
                      <span>Costo total</span>
                      <span>Costo por quintal</span>
                    </div>
                    <div className="datos">
                      {result.length > 0 ? (
                        result.map((item, index) => (
                          <div className="dato" key={index}>
                            <span>{item.partida}</span>

                            <span className="productor">
                              {new Date(item.fecha_bodega).toLocaleDateString(
                                "es-ES"
                              )}
                            </span>
                            <span>{item.proceso}</span>
                            <span>{item.cantidad}</span>
                            <span>
                              Q. {Number(item.precio).toLocaleString()}
                            </span>
                            <span>{item.pesototalmaduro}</span>
                            <span>{item.rendimiento}</span>
                            <span>
                              Q.{" "}
                              {Number(item.costoTotalMaduro).toLocaleString()}
                            </span>
                            <span>{item.beneficio}</span>
                            <span>{item.costoTotalBeneficio}</span>
                            <span>
                              Q. {Number(item.costoQuintal).toLocaleString()}
                            </span>
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
export default CostoProduccion;
