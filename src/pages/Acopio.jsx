import React, { useState, useEffect } from "react";
import { Encabezado, NavBar } from "../components";
import "../styles/Acopio.css";
import Swal from "sweetalert2";
import { IniciarCompra } from "../components/mod/IniciarCompra";
import ToggleSwitch2 from "../components/BotonToggle2";
import Comprobante from "../components/PDF/comprobante";
import { set } from "react-hook-form";

export const Acopio = () => {
  const URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const usuario = localStorage.getItem("username");
  const codigo = localStorage.getItem("codigo");
  const [compra, setCompra] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [preciodia, setPreciodia] = useState({});
  const [precioFlete, setPrecioFlete] = useState({});
  const [partida, setPartida] = useState({});
  const [resumenAcopio, setResumenAcopio] = useState({});
  const [vehiculos, setVehiculos] = useState({});
  const [estadocompra, setActivo] = useState(false);
  const [conflete, setConFlete] = useState(false);
  const [consignar, setConsignar] = useState(false);
  const [nombreproductor, setNombreProductor] = useState("");
  const [observacion, setObservacion] = useState("");
  const [codigoProductor, setCodigoProductor] = useState(null);
  const [selectedOption, setSelectedOption] = useState(1);
  const [vehiculoseleccionado, setVehiculoSeleccionado] = useState(null);
  const [productores, setProductores] = useState({});
  const [comprobanteP, setComprobante] = useState({});

  const precioBase = preciodia?.preciobase || 0;
  const precioSocio = preciodia?.socio || 0;
  const precioRecolector = preciodia?.recolector || 0;
  const precioEspecial = preciodia?.especial || 0;
  const pFlete = precioFlete?.precio || 0;
  const costo = resumenAcopio.costo || 0;

  const [estadoModal1, cambiarEstadoModal1] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [peso, setPeso] = useState(0);
  const [tara, setTara] = useState(0);
  const [filas, setFilas] = useState([]);

  const handleInputChangeProductor = (event) => {
    const value = event.target.value;
    setNombreProductor(value);

    if (value) {
      const filteredSuggestions = productores.filter((item) =>
        item.nombre.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };
  const handleSuggestionClick = (suggestion) => {
    setNombreProductor(suggestion.nombre);
    setCodigoProductor(suggestion.pk_productor);
    setSuggestions([]);
  };

  // --------------------- capturar los precios del dia ---------------------

  const verificarCompra = async () => {
    try {
      const response = await fetch(URL + "acopio/estado", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      const estadoCompra = await response.json();
      setActivo(estadoCompra);
    } catch (err) {
      console.error(err);
    }
  };

  const precios = async () => {
    try {
      const response = await fetch(URL + "acopio", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      const resVehiculo = await fetch(URL + "acopio/vehiculo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      const datos = await response.json();
      const datosVehiculo = await resVehiculo.json();
      console.log("Datos recibidos de la API:", datos); // Verifica la estructura aquí

      // Desestructurar los datos recibidos en tres variables distintas
      setVehiculos(datosVehiculo);
      const { precioDia, precioFlete, partida } = datos;
      setPreciodia(precioDia);
      setPrecioFlete(precioFlete);
      setPartida(partida);
    } catch (err) {
      console.error(err);
    }
  };

  //------------------------------------ OBTENCION DE TOTALES DE ACOPIO ----------------------------------
  const ResumenAcopio = async () => {
    try {
      const acopioData = await fetch(`${URL}acopio/total`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      const datos = await acopioData.json();
      setResumenAcopio(datos);
      console.log(datos);
    } catch {}
  };

  useEffect(() => {
    const date = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(date.toLocaleDateString("es-ES", options));

    // Actualizar la hora cada segundo
    const interval = setInterval(() => {
      const time = new Date();
      const formattedTime = time
        .toLocaleTimeString("es-ES", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true, // Usar formato de 12 horas
        })
        .replace(/\./g, ""); // Eliminar los puntos en el formato de AM/PM
      setCurrentTime(formattedTime);
    }, 1000);

    // Limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    verificarCompra();
    precios();
    compras();
    ResumenAcopio();
    productor();
  }, []);

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

  const calcularTotales = () => {
    const base = parseFloat(precioBase) || 0;
    const socio = parseFloat(precioSocio) || 0;
    const especial = parseFloat(precioEspecial) || 0;
    const recolector = parseFloat(precioRecolector) || 0;
    const flete = parseFloat(pFlete) || 0;
    let cflete = 0;
    if (conflete === true) {
      cflete = flete * totalNeto;
    }

    switch (selectedOption) {
      case 1:
        return (totalNeto * base - cflete).toFixed(2);
      case 2:
        return (totalNeto * (base + socio) - cflete).toFixed(2);
      case 3:
        return (totalNeto * (base + socio + especial) - cflete).toFixed(2);
      case 4:
        return (totalNeto * (base + recolector) - cflete).toFixed(2);
      default:
        const totalPagar = 0;
        return totalPagar.toFixed(2);
    }
  };

  const totales = calcularTotales();

  const handleOptionChange = (event) => {
    const optionValue = Number(event.target.value);
    setSelectedOption(optionValue);

    // Actualiza consignar basado en la opción seleccionada
    if (optionValue === 2 || optionValue === 3) {
      setConsignar(true);
    } else {
      setConsignar(false);
    }
  };

  const handleToggleChange = (value) => {
    if (value) {
      setSelectedOption(2);
      setConsignar(true);
    } else {
      setSelectedOption(1);
      setConsignar(false);
    }
  };

  const handleVehiculoChange = (event) => {
    const selectedValue = event.target.value;
    // Convierte el valor a false si es el valor vacío
    setVehiculoSeleccionado(selectedValue === "" ? false : selectedValue);
  };

  useEffect(() => {
    // Verifica si vehiculoSeleccionado es un string no vacío
    if (vehiculoseleccionado && typeof vehiculoseleccionado === "string") {
      setConFlete(true);
    } else {
      setConFlete(false);
    }
  }, [vehiculoseleccionado]);

  // --------------------- capturar los productores ---------------------

  const productor = async () => {
    try {
      const response = await fetch(URL + "productores", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      const datos = await response.json();
      console.log("Datos recibidos de la API:", datos); // Verifica la estructura aquí
      setProductores(datos);
    } catch (err) {
      console.error(err);
    }
  };

  //--------------------- capturar los compras ---------------------
  const compras = async () => {
    try {
      const response = await fetch(URL + "acopio/compras", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
      });
      const datos = await response.json();
      console.log("Datos recibidos de la API:", datos);
      setCompra(datos); // Verifica la estructura aquí
    } catch (err) {
      console.error(err);
    }
  };

  //--------------------- COMPOROBANTE DE COMPRA ---------------------
  const comprobante = async () => {
    try {
      const codigo_productor = codigoProductor; // Agrega el código del productor si es necesario
      const nombre_productor = nombreproductor; // El nombre del productor
      const response = await fetch(
        `${URL}acopio/comprobante?nombre_productor=${encodeURIComponent(
          nombre_productor
        )}&codigo_productor=${encodeURIComponent(codigo_productor)}`,
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
      setComprobante(data);
    } catch (err) {
      console.error(err);
    }
  };

  console.log(comprobanteP);

  //-------------- FINANLIZAR COMPRA ---------------------
  const finalizarCompra = async () => {
    try {
      const response = await fetch(URL + "acopio/finalizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
        body: JSON.stringify({
          maduro: totalmaduro,
          codigo: codigo,
        }),
      });

      if (response.ok) {
        verificarCompra();
      } else {
        console.error("Error al finalizar la compra");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo finalizar la compra.",
      });
      console.error(err);
    }
  };

  //---------------------- COMPRAR ---------------------

  const handlesetObservacion = (event) => {
    setObservacion(event.target.value); // Actualiza el estado con el valor del input
  };

  const comprar = async () => {
    try {
      const response = await fetch(URL + "acopio/comprar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
        body: JSON.stringify({
          id_productor: codigoProductor,
          tipo: selectedOption,
          nombre_prod: nombreproductor,
          peso_bruto: totalBruto,
          tara: totalTara,
          consignar: consignar,
          observacion: observacion,
          con_flete: conflete,
          vehiculo: vehiculoseleccionado,
          codigo: codigo,
        }),
      });
      const comprobnte = await comprobante();
      if (response.ok) {
        comprobnte;
        compras();
        ResumenAcopio();
        setFilas([]);
        setObservacion("");
        setNombreProductor("");
        setConFlete(false);
        setConsignar(false);
        setSelectedOption(1);
        setVehiculoSeleccionado("");
        setCodigoProductor(null);
        productor();
        mostrarAlerta(
          "success",
          "Compra realizada",
          "Compra realizada con éxito",
          "Imprimir"
        );
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.message || "Error al comprar",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo comprar.",
      });
      console.error(err);
    }
  };

  //------------------------ mostrar alerta

  const mostrarAlerta = (icon, title, text, confirmButton) => {
    Swal.fire({
      title: title,
      icon: icon,
      text: text,
      confirmButtonText: confirmButton,
      confirmButtonColor: "#FF8A00",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#5E5E5E",
      buttonsStyling: false,
      showCloseButton: true,
      html: `<Comprobante onClick={comprar} data={comprobanteP} />
`,
      customClass: {
        confirmButton: "btEliminar",
        cancelButton: "btCancelar",
        popup: "popus-class",
        title: "titulo-pop",
        text: "text-pop",
        icon: "icon-pop",
        container: "contenedor-alert",
      },
    }).then((response) => {
      if (response.isConfirmed) {
        console.log("print");
      }
    });
  };
  // Eliminar una fila de la tabla de pesajes

  const eliminarFila = (index) => {
    const nuevasFilas = filas.filter((_, i) => i !== index);
    setFilas(nuevasFilas);
  };

  const handleCloseModal1 = () => {
    cambiarEstadoModal1(!estadoModal1);
    setActivo(true);
    precios();
  };

  //------------busqueda inteligente -----------------
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
  // Calcular el total de peso neto de las compras realizadas
  const totalmaduro = compra
    .reduce((acc, item) => acc + parseFloat(item.pesoneto), 0)
    .toFixed(2);

  return (
    <>
      <div className="vista">
        <NavBar />
        <Encabezado titulo="Acopio" />
        <div className="Contenedor">
          <div className="main1">
            <div className="cont">
              <div className="contDato">
                <div className="datoEnc">
                  <p>Encargado:</p>
                  <h3>{usuario}</h3>
                </div>
              </div>
              <div className="contDato">
                <h3>Partida</h3>
                <h3># {estadocompra ? partida?.partida : "--"}</h3>
              </div>
            </div>

            <div className="contPrecio">
              <div className="titulo">
                <h4>Precio del día</h4>
              </div>
              <div className="precios">
                <div className="precio">
                  <span>precio base:</span>{" "}
                  <div className="contP">
                    <h4>{estadocompra ? preciodia?.preciobase : "--"}</h4>
                  </div>
                </div>
                <div className="precio">
                  <span>Socio:</span>{" "}
                  <div className="contP">
                    <h4>{estadocompra ? preciodia?.socio : "--"}</h4>
                  </div>
                </div>
                <div className="precio">
                  <span>Recolector:</span>{" "}
                  <div className="contP">
                    <h4>{estadocompra ? preciodia?.recolector : "--"}</h4>
                  </div>
                </div>
                <div className="precio">
                  <span>Especial:</span>{" "}
                  <div className="contP">
                    <h4>{estadocompra ? preciodia?.especial : "--"}</h4>
                  </div>
                </div>
                <div className="precio">
                  <span>Flete:</span>{" "}
                  <div className="contP">
                    <h4>{estadocompra ? precioFlete.precio : "--"}</h4>
                  </div>
                </div>
              </div>
            </div>
            <IniciarCompra
              estado={estadoModal1}
              cambiarEstado={handleCloseModal1}
              titulo="Ingresar precio del día"
            />
            <div className="contFecha">
              <div className="contDato">
                <p>{currentDate}</p>
                <h2>{currentTime}</h2>
              </div>
              <div className="contDato">
                {estadocompra ? (
                  <button
                    onClick={() =>
                      Swal.fire({
                        title: "¿Desea finalizar la compra?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sí",
                        cancelButtonText: "No",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          finalizarCompra();
                        }
                      })
                    }
                  >
                    Finalizar compra
                  </button>
                ) : (
                  <button onClick={() => cambiarEstadoModal1(!estadoModal1)}>
                    Iniciar compra
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="main2">
            <div className="cont1">
              <div className="datoProductor">
                <h2>Datos del productor</h2>
                <div className="datos">
                  <div className="dato">
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      className="nombreProd"
                      value={nombreproductor}
                      onChange={handleInputChangeProductor}
                    />
                    {suggestions.length > 0 && (
                      <ul className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion.nombre}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="toggle">
                      <h4>Consignar</h4>
                      <ToggleSwitch2
                        isChecked={consignar}
                        onToggle={handleToggleChange}
                      />
                    </div>
                  </div>
                  <div className="dato">
                    <div className="selectRBT">
                      <div className="radiobt">
                        <input
                          type="radio"
                          name="group1"
                          value={1}
                          checked={selectedOption === 1}
                          onChange={handleOptionChange}
                        />
                        <p>PA</p>
                      </div>

                      <div className="radiobt">
                        <input
                          type="radio"
                          name="group1"
                          value={2}
                          checked={selectedOption === 2}
                          onChange={handleOptionChange}
                        />
                        <p>PR</p>
                      </div>
                      <div className="radiobt">
                        <input
                          type="radio"
                          name="group1"
                          value={3}
                          checked={selectedOption === 3}
                          onChange={handleOptionChange}
                        />
                        <p>SO</p>
                      </div>
                      <div className="radiobt">
                        <input
                          type="radio"
                          name="group1"
                          value={4}
                          checked={selectedOption === 4}
                          onChange={handleOptionChange}
                        />
                        <p>RE</p>
                      </div>
                    </div>
                    <div className="botones">
                      <select
                        name="vehiculo"
                        id="vehiculo"
                        onChange={handleVehiculoChange}
                      >
                        <option value="">Vehículo</option>
                        {vehiculos.length > 0 ? (
                          vehiculos.map((vehiculo, index) => (
                            <option key={index} value={vehiculo.codigo}>
                              {vehiculo.alias || vehiculo.vehiculo}
                            </option>
                          ))
                        ) : (
                          <option value={null}>
                            No hay vehículos disponibles
                          </option>
                        )}
                      </select>
                      <Comprobante onClick={comprar} data={comprobanteP} />
                      <button onClick={comprar}>Guardar</button>
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
                      <span className="material-symbols-outlined">delete</span>
                    </button>

                    <button
                      className="agregar"
                      onClick={() => {
                        if (!estadocompra) {
                          Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text: "Debe iniciar una compra para poder ingresar un pesaje.",
                          });
                        } else {
                          agregarFila();
                        }
                      }}
                    >
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
                    <p>Observaciones</p>
                    <input
                      type="text"
                      value={observacion}
                      onChange={handlesetObservacion}
                    />
                  </div>
                  <div className="total">
                    {/* <h2>Q. {Number(totales.totalPagar).toLocaleString()}</h2> */}
                    <h2>Q. {totales.toLocaleString()}</h2>
                    <p>Total a pagar</p>
                  </div>
                </div>
              </div>
              <div className="resumen">
                <div className="encR">
                  <h2>Resumen acopio</h2>

                  <h4>{currentDate}</h4>
                </div>
                <div className="datosR">
                  <div className="datoR">
                    <h4>compra</h4>
                    <h2>{estadocompra ? resumenAcopio.compra || 0 : "--"}</h2>
                    <p>quintales</p>
                  </div>
                  <div className="datoR">
                    <h4>Consignado</h4>
                    <h2>
                      {estadocompra ? resumenAcopio.consignado || 0 : "--"}
                    </h2>
                    <p>quintales</p>
                  </div>
                  <div className="datoR">
                    <h4>Recolectado</h4>
                    <h2>
                      {estadocompra ? resumenAcopio.recolector || 0 : "--"}
                    </h2>
                    <p>quintales</p>
                  </div>
                </div>
                <div className="total">
                  <h2>Total</h2>
                  <div className="T">
                    <h2> {estadocompra ? resumenAcopio.total || 0 : "--"}</h2>
                    <h5>quintales</h5>
                  </div>
                </div>
              </div>
            </div>

            <div className="cont2">
              <div className="titulo">
                <h3>Compras realizadas</h3>
                <div className="buscador">
                  <input type="text" placeholder="Buscar" onChange={searcher} />
                  <button>
                    <span class="material-symbols-outlined">search</span>
                  </button>
                </div>
              </div>

              <div className="tabla">
                <div className="encabezado">
                  <span className="productor">Productor</span>
                  <span>Peso bruto</span>
                  <span>Tara</span>
                  <span>Peso neto</span>
                  <span>Costo</span>
                  <div></div>
                  <span>Acciones</span>
                </div>
                <div className="datos">
                  {estadocompra ? (
                    result.map((item, index) => (
                      <div className="dato" key={index}>
                        <span className="productor">{item.nombre}</span>
                        <span>{item.pesobruto}</span>
                        <span>{item.tara}</span>
                        <span>{item.pesoneto}</span>
                        <span>Q. {Number(item.total).toLocaleString()}</span>
                        <div className="botones">
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
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No hay compras realizadas</p>
                  )}
                </div>
                <div className="totalcompra">
                  <h2>Total:</h2>
                  <h2>
                    Q. {estadocompra ? Number(costo).toLocaleString() : "--"}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
