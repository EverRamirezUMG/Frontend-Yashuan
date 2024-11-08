import React, { useEffect, useState } from "react";
import styled from "styled-components";
import swal from "sweetalert2";
import "./styles/Updatecomprobantes.css";

const UpdateComprobante = ({
  children,
  estado2,
  cambiarEstado2,
  titulo2,
  idcomprobante,
  setCompras,
  compras,
}) => {
  const [comprobantes, setComprobante] = useState({});
  const [tipo, setTipo] = useState([]);
  const [loading, setLoading] = useState(false);
  const URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const [comprobanteUP, setComprobanteUP] = useState({
    codigo: "",
    nombre: "",
    peso_bruto: "",
    tara: "",
    tipo: "",
    observacion: "",
    consignar: false, // Inicializar como false
  });

  useEffect(() => {
    if (idcomprobante) {
      const getDataUp = async (codigo) => {
        setLoading(true);
        try {
          const response = await fetch(`${URL}acopio/comprobante/${codigo}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const resComprobante = await response.json();
          setComprobante(resComprobante);
          setComprobanteUP({
            codigo: resComprobante.pk_comprobante,
            nombre: resComprobante.nombre,
            peso_bruto: resComprobante.pesobruto,
            tara: resComprobante.tara,
            tipo: resComprobante.tipo,
            observacion: resComprobante.observacion,
            consignar: resComprobante.consignar || false, // Asegurarse de que sea booleano
          });
        } catch (err) {
          console.error(err);
        }
        setLoading(false);
      };
      getDataUp(idcomprobante);
    }
  }, [idcomprobante, URL, token]);

  const getRoles = async () => {
    try {
      const response = await fetch(`${URL}acopio/tipo`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTipo(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRoles();
  }, [URL, token]);

  const onChangeData = (e) => {
    const { name, value, type, checked } = e.target;
    setComprobanteUP({
      ...comprobanteUP,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}acopio/actualizar/${idcomprobante}`, {
        method: "PUT",
        body: JSON.stringify(comprobanteUP),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCompras(
          compras.map((compra) =>
            compra.pk_comprobante === data.pk_comprobante ? data : compra
          )
        );
        cambiarEstado2(false);
        swal.fire({
          title: "Compra Actualizada!",
          icon: "success",
          showConfirmButton: false,
          timer: 1200,
          customClass: {
            confirmButton: "btEliminar",
            cancelButton: "btCancelar",
            popup: "popus-eliminado",
            title: "titulo-pop",
            container: "contenedor-alert",
          },
        });
      } else {
        throw new Error("Error al actualizar");
      }
    } catch (error) {
      console.error(error.message);
      swal.fire({
        title: "Error al Actualizar!",
        icon: "error",
        showConfirmButton: false,
        timer: 1200,
        customClass: {
          confirmButton: "btEliminar",
          cancelButton: "btCancelar",
          popup: "popus-eliminado",
          title: "titulo-pop",
          container: "contenedor-alert",
        },
      });
    }
  };

  return (
    <>
      {estado2 && (
        <Overlay>
          <ContenedorModal>
            <EncabezadoModal>
              <h3>
                <b>{titulo2}</b>
              </h3>
            </EncabezadoModal>
            <BotonCerrar onClick={() => cambiarEstado2(false)}>
              <span className="material-symbols-outlined">close</span>
            </BotonCerrar>
            {loading ? (
              <div className="spinner">
                <div className="lds-dual-ring"></div>
              </div>
            ) : (
              <div className="contenedor-comprobante">
                <form className="comprobante-from" onSubmit={handleSubmit}>
                  <div className="titulo-comp">
                    <h3>{comprobantes.nombre}</h3>
                    <p>{comprobantes.pk_comprobante}</p>
                  </div>
                  {["peso_bruto", "tara", "observacion"].map((field) => (
                    <div className="item-comp" key={field}>
                      <label>
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                      </label>
                      <input
                        type={
                          field === "peso_bruto" || field === "tara"
                            ? "number"
                            : "text"
                        }
                        id={field}
                        name={field}
                        placeholder={
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        value={comprobanteUP[field]}
                        onChange={onChangeData}
                      />
                    </div>
                  ))}
                  <div className="itemUser">
                    <label> Consignar: </label>
                    <input
                      type="checkbox"
                      id="consignar"
                      name="consignar"
                      checked={comprobanteUP.consignar}
                      onChange={(e) =>
                        setComprobanteUP({
                          ...comprobanteUP,
                          consignar: e.target.checked,
                        })
                      }
                    />
                  </div>
                  <div className="itemUser">
                    <label> Tipo: </label>
                    <select
                      name="tipo"
                      id="tipo"
                      value={comprobanteUP.tipo}
                      onChange={onChangeData}
                    >
                      {tipo.map((t) => (
                        <option key={t.idtproductor} value={t.idtproductor}>
                          {t.tipo}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="botones-comp">
                    <button
                      type="button"
                      onClick={() => cambiarEstado2(false)}
                      className="btcancelar"
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btGuardar">
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            )}
            {children}
          </ContenedorModal>
        </Overlay>
      )}
    </>
  );
};

export default UpdateComprobante;

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
`;

const ContenedorModal = styled.div`
  width: 550px;
  min-height: 600px;
  background: #f5f5f5;
  position: relative;
  border-radius: 15px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 20px;
  z-index: 9999;
`;

const EncabezadoModal = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
  color: #000;
`;

const BotonCerrar = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  cursor: pointer;
  transition: 0.3s ease all;
  border-radius: 2px;
  color: #e8e8e8;
  padding: 2px 0;

  &:hover {
    background: #ff8a00;
    transition: 0.3s;
  }

  span {
    width: 100%;
    height: 100%;
  }
`;
