import React, { useEffect, useState } from "react";
import styled from "styled-components";
import swal from "sweetalert2";
import "./styles/Permisos.css";
import ToggleSwitch2 from "../BotonToggle2";

const Permisos = ({ estado3, cambiarEstado3, titulo2, idEdit }) => {
  const URL = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const [permiso, setPermiso] = useState({});
  const [UpPermiso, setUpPermiso] = useState({});
  const [loading, setLoading] = useState(false);

  const getDataUp = async (idEdit) => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}permiso/${idEdit}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const permisos = await response.json();
      setPermiso(permisos);
      setUpPermiso(permisos); // Initialize UpPermiso with fetched data
      console.log(permisos);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDataUp(idEdit);
  }, [idEdit]);

  const handleChange = (key, value) => {
    setUpPermiso((prevPermiso) => ({
      ...prevPermiso,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${URL}permiso/${idEdit}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(UpPermiso),
      });
      if (response.ok) {
        swal.fire("Éxito", "Permisos actualizados correctamente", "success");
        cambiarEstado3(false); // Close the modal on success
      } else {
        swal.fire(
          "Error",
          "Hubo un problema al actualizar los permisos",
          "error"
        );
      }
    } catch (err) {
      console.error(err);
      swal.fire(
        "Error",
        "Hubo un problema al actualizar los permisos",
        "error"
      );
    }
    setLoading(false);
    getDataUp(idEdit);
  };

  return (
    <>
      {estado3 && (
        <Overlay>
          <ContenedorModal>
            <EncabezadoModal>
              <h3>
                {titulo2}: {permiso ? permiso.fk_usuario : "Cargando..."}
              </h3>
              <br />
            </EncabezadoModal>
            <BotonCerrar onClick={() => cambiarEstado3(false)}>
              <span className="material-symbols-outlined">close</span>
            </BotonCerrar>

            {loading ? (
              <div className="spinner">
                <div className="lds-dual-ring"></div>
              </div>
            ) : (
              <div className="ContenedorPermiso">
                <form className="PermisoForm" onSubmit={handleSubmit}>
                  <div className="modulo">
                    <h4>Analisis</h4>
                    <div className="itemPermiso">
                      <label>Analisis:</label>
                      <ToggleSwitch2
                        isChecked={!!permiso.analisis}
                        onToggle={(value) => handleChange("analisis", value)}
                      />
                    </div>

                    <div className="itemPermiso">
                      <label>Rendimiento: </label>
                      <ToggleSwitch2
                        isChecked={!!permiso.rendimiento}
                        onToggle={(value) => handleChange("rendimiento", value)}
                      />
                    </div>

                    <div className="itemPermiso">
                      <label>Resumen temporada: </label>
                      <ToggleSwitch2
                        isChecked={!!permiso.resumentemporada}
                        onToggle={(value) =>
                          handleChange("resumentemporada", value)
                        }
                      />
                    </div>
                  </div>

                  <div className="modulo">
                    <h4>Inventario</h4>
                    <div className="itemPermiso">
                      <label>Inventario: </label>
                      <ToggleSwitch2
                        isChecked={!!permiso.inventario}
                        onToggle={(value) => handleChange("inventario", value)}
                      />
                    </div>

                    <div className="itemPermiso">
                      <label>Vehiculos: </label>
                      <ToggleSwitch2
                        isChecked={!!permiso.vehiculos}
                        onToggle={(value) => handleChange("vehiculos", value)}
                      />
                    </div>

                    <div className="itemPermiso">
                      <label>Ingreso pergamino: </label>
                      <ToggleSwitch2
                        isChecked={!!permiso.pergamino}
                        onToggle={(value) => handleChange("pergamino", value)}
                      />
                    </div>
                  </div>

                  <div className="modulo">
                    <h4>Ventas</h4>
                    <div className="itemPermiso">
                      <label>Venta: </label>
                      <ToggleSwitch2
                        isChecked={!!permiso.venta}
                        onToggle={(value) => handleChange("venta", value)}
                      />
                    </div>

                    <div className="itemPermiso">
                      <label>Muestra: </label>
                      <ToggleSwitch2
                        isChecked={!!permiso.muestra}
                        onToggle={(value) => handleChange("muestra", value)}
                      />
                    </div>

                    <div className="itemPermiso">
                      <label>Cliente:</label>
                      <ToggleSwitch2
                        isChecked={!!permiso.cliente}
                        onToggle={(value) => handleChange("cliente", value)}
                      />
                    </div>

                    <div className="itemPermiso">
                      <label>Envio: </label>
                      <ToggleSwitch2
                        isChecked={!!permiso.envio}
                        onToggle={(value) => handleChange("envio", value)}
                      />
                    </div>
                  </div>
                  <div className="modulo">
                    <h4>Acopio</h4>
                    <div className="itemPermiso">
                      <label>Compra:</label>
                      <ToggleSwitch2
                        isChecked={!!permiso.compra}
                        onToggle={(value) => handleChange("compra", value)}
                      />
                    </div>
                    <div className="itemPermiso">
                      <label>Precio del día: </label>
                      <ToggleSwitch2
                        isChecked={!!permiso.preciodia}
                        onToggle={(value) => handleChange("preciodia", value)}
                      />
                    </div>
                    <div className="itemPermiso">
                      <label>Productores: </label>
                      <ToggleSwitch2
                        isChecked={!!permiso.productores}
                        onToggle={(value) => handleChange("productores", value)}
                      />
                    </div>

                    <div className="itemPermiso">
                      <label>Resumen: </label>
                      <ToggleSwitch2
                        isChecked={!!permiso.resumen}
                        onToggle={(value) => handleChange("resumen", value)}
                      />
                    </div>
                  </div>
                  <div className="modulo">
                    <h4>Costo de producción</h4>
                    <div className="itemPermiso">
                      <label>Costo de producción: </label>
                      <ToggleSwitch2
                        isChecked={!!permiso.costoproduccion}
                        onToggle={(value) =>
                          handleChange("costoproduccion", value)
                        }
                      />
                    </div>
                  </div>

                  <div className="modulo">
                    <h4>Usuarios</h4>
                    <div className="itemPermiso">
                      <label>Usuarios: </label>
                      <ToggleSwitch2
                        isChecked={!!permiso.usuarios}
                        onToggle={(value) => handleChange("usuarios", value)}
                      />
                    </div>
                  </div>
                  {/* 
                  <div className="modulo">
                    <h4>Página WEB</h4>
                    <div className="itemPermiso">
                      <label>Pagina WEB </label>
                      <ToggleSwitch2
                        isChecked={!!permiso.paginaweb}
                        onToggle={(value) => handleChange("paginaweb", value)}
                      />
                    </div>
                  </div> */}
                  <div className="bonotesNewUser">
                    <div>
                      <button
                        type="button"
                        onClick={() => cambiarEstado3(false)}
                        className="btcancelar"
                      >
                        Cancelar
                      </button>
                    </div>
                    <div>
                      <button type="submit" className="btGuardar">
                        Guardar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </ContenedorModal>
        </Overlay>
      )}
    </>
  );
};

export default Permisos;

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.1);
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999998;
`;

const ContenedorModal = styled.div`
  width: 650px;
  min-height: 600px;
  background: #f5f5f5;
  position: relative;
  border-radius: 15px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 20px;
  z-index: 99999999;
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
  padding: 2px 0px;

  &:hover {
    background: #ff8a00;
    transition: 0.3s;
  }

  span {
    width: 100%;
    height: 100%;
  }
`;
