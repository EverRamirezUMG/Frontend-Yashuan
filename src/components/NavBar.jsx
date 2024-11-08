import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "./Styles/NavBar-escritorio.css";
import RemoverPermisos from "../auth/RemoverPermisos";
import PermisoUsuario from "../auth/Permisos";

export const NavBar = () => {
  useEffect(() => {
    PermisoUsuario();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const [isAnalysisMenuOpen, setIsAnalysisMenuOpen] = useState(false);
  const [isSalesMenuOpen, setIsSalesMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAcopioMenuOpen, setIsAcopioMenuOpen] = useState(false);
  const [isCostoMenuOpen, setIsCostoMenuOpen] = useState(false);

  //------ Permisos de usuario------
  const Superusuario = localStorage.getItem("superusuario");
  const Cargo = localStorage.getItem("cargo");
  const Analisis = localStorage.getItem("analisis");
  const Rendimiento = localStorage.getItem("rendimiento");
  const ResumenTemporada = localStorage.getItem("resumentemporada");
  const Inventario = localStorage.getItem("inventario");
  const Compra = localStorage.getItem("compra");
  const Productores = localStorage.getItem("productores");
  const Resumen = localStorage.getItem("resumen");
  const Venta = localStorage.getItem("venta");
  const Muestra = localStorage.getItem("muestra");
  const Cliente = localStorage.getItem("cliente");
  const Envio = localStorage.getItem("envio");
  const CostoProduccion = localStorage.getItem("costoproduccion");
  const Usuarios = localStorage.getItem("usuarios");
  const PaginaWeb = localStorage.getItem("paginaweb");

  const handleButtonClick = (route) => {
    navigate(route);
  };

  const toggleAnalysisMenu = () => {
    setIsAnalysisMenuOpen(!isAnalysisMenuOpen);
  };

  const toggleSalesMenu = () => {
    setIsSalesMenuOpen(!isSalesMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleAcopioMenu = () => {
    setIsAcopioMenuOpen(!isAcopioMenuOpen);
  };
  const toggleCostoMenu = () => {
    setIsCostoMenuOpen(!isCostoMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("imagen");
    RemoverPermisos();
    navigate("/Admin");
  };

  return (
    <>
      <nav className="NavBar">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="menu">
          {/* Botón de Análisis */}

          {Superusuario === true ||
          Cargo === "Administrador" ||
          Analisis === "true" ? (
            <div className="navA">
              <button
                type="button"
                className={`navA ${
                  location.pathname.startsWith("/Admin/Inicio") ? "active" : ""
                }`}
                onClick={toggleAnalysisMenu}
              >
                <div className="Reportes">
                  <span className="material-symbols-outlined">area_chart</span>
                  <span> Análisis</span>
                  <span className="material-symbols-outlined">
                    {isAnalysisMenuOpen ? "expand_less" : "expand_more"}
                  </span>
                </div>
              </button>

              {isAnalysisMenuOpen && (
                <div className="dropdown-menu">
                  <button
                    type="button"
                    className={`navA ${
                      location.pathname === "/Admin/Inicio" ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick("/Admin/Inicio")}
                  >
                    <div className="Reportes">
                      <span> Inicio</span>
                    </div>
                  </button>
                  {Rendimiento === "true" ? (
                    <button
                      type="button"
                      className={`navA ${
                        location.pathname === "/Admin/Inicio/Rendimiento"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleButtonClick("/Admin/Inicio/Rendimiento")
                      }
                    >
                      <div className="Reportes">
                        <span> Rendimiento</span>
                      </div>
                    </button>
                  ) : null}
                  {/* {ResumenTemporada === "true" ? (
                    <button
                      type="button"
                      className={`navA ${
                        location.pathname === "/Admin/Inicio/Temporada"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleButtonClick("/Admin/Inicio/Temporada")
                      }
                    >
                      <div className="Reportes">
                        <span> Temporada</span>
                      </div>
                    </button>
                  ) : null} */}
                </div>
              )}
            </div>
          ) : null}

          {/* Botón de Acopio con submenú */}
          {Superusuario === true ||
          Cargo === "Administrador" ||
          Compra === "true" ? (
            <div className="navA">
              <button
                type="button"
                className={`navA ${
                  location.pathname.startsWith("/Admin/Acopio") ? "active" : ""
                }`}
                onClick={toggleAcopioMenu}
              >
                <div className="Reportes">
                  <span className="material-symbols-outlined">balance</span>
                  <span> Acopio</span>
                  <span className="material-symbols-outlined">
                    {isAcopioMenuOpen ? "expand_less" : "expand_more"}
                  </span>
                </div>
              </button>

              {isAcopioMenuOpen && (
                <div className="dropdown-menu">
                  <button
                    type="button"
                    className={`navA ${
                      location.pathname === "/Admin/Acopio" ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick("/Admin/Acopio")}
                  >
                    <div className="Reportes">
                      <span> Compra</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`navA ${
                      location.pathname === "/Admin/Acopio/Resumen"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleButtonClick("/Admin/Acopio/Resumen")}
                  >
                    <div className="Reportes">
                      <span> Resumen </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`navA ${
                      location.pathname === "/Admin/Acopio/Productores"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleButtonClick("/Admin/Acopio/Productores")
                    }
                  >
                    <div className="Reportes">
                      <span> Productores </span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : null}
          {/* Botón de Inventario */}
          {Superusuario === true ||
          Cargo === "Administrador" ||
          Cargo === "Encargado venta" ||
          Inventario === "true" ? (
            <button
              type="button"
              className={`navA ${
                location.pathname === "/Admin/Inventario" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("/Admin/Inventario")}
            >
              <div className="Reportes">
                <span className="material-symbols-outlined">deployed_code</span>
                <span> Inventario</span>
              </div>
            </button>
          ) : null}

          {/* Botón de Ventas con submenú */}
          {Superusuario === true ||
          Cargo === "Administrador" ||
          Cargo === "Encargado venta" ||
          Venta === "true" ? (
            <div className="navA">
              <button
                type="button"
                className={`navA ${
                  location.pathname.startsWith("/Admin/Ventas") ? "active" : ""
                }`}
                onClick={toggleSalesMenu}
              >
                <div className="Reportes">
                  <span className="material-symbols-outlined">local_cafe</span>
                  <span> Ventas</span>
                  <span className="material-symbols-outlined">
                    {isSalesMenuOpen ? "expand_less" : "expand_more"}
                  </span>
                </div>
              </button>

              {isSalesMenuOpen && (
                <div className="dropdown-menu">
                  <button
                    type="button"
                    className={`navA ${
                      location.pathname === "/Admin/Ventas/Muestra"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleButtonClick("/Admin/Ventas/Muestra")}
                  >
                    <div className="Reportes">
                      <span> Muestra</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`navA ${
                      location.pathname === "/Admin/Ventas" ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick("/Admin/Ventas")}
                  >
                    <div className="Reportes">
                      <span> Ventas</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`navA ${
                      location.pathname === "/Admin/Ventas/Clientes"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleButtonClick("/Admin/Ventas/Clientes")}
                  >
                    <div className="Reportes">
                      <span> Cliente </span>
                    </div>
                  </button>
                  {/* 
                  <button
                    type="button"
                    className={`navA ${
                      location.pathname === "/Admin/Envio" ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick("/Admin/Envio")}
                  >
                    <div className="Reportes">
                      <span> Envío</span>
                    </div>
                  </button> */}
                </div>
              )}
            </div>
          ) : null}

          {/* Botón de Costo de producción */}
          {Superusuario === true ||
          Cargo === "Administrador" ||
          CostoProduccion === "true" ? (
            <div className="navA">
              <button
                type="button"
                className={`navA ${
                  location.pathname.startsWith("/Admin/CostoProduccion")
                    ? "active"
                    : ""
                }`}
                onClick={toggleCostoMenu}
              >
                <div className="Reportes">
                  <span class="material-symbols-outlined">manufacturing</span>
                  <span> Costo de producción</span>
                  <span className="material-symbols-outlined">
                    {isCostoMenuOpen ? "expand_less" : "expand_more"}
                  </span>
                </div>
              </button>

              {isCostoMenuOpen && (
                <div className="dropdown-menu">
                  <button
                    type="button"
                    className={`navA ${
                      location.pathname === "/Admin/CostoProduccion"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleButtonClick("/Admin/CostoProduccion")}
                  >
                    <span> Costo de produccion</span>
                  </button>
                  <button
                    type="button"
                    className={`navA ${
                      location.pathname === "/Admin/CostoProduccion/Flete"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleButtonClick("/Admin/CostoProduccion/Flete")
                    }
                  >
                    <div className="Reportes">
                      <span> Flete</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`navA ${
                      location.pathname ===
                      "/Admin/CostoProduccion/Mantenimiento"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleButtonClick("/Admin/CostoProduccion/Mantenimiento")
                    }
                  >
                    <div className="Reportes">
                      <span> Mantenimiento</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* Botón de Usuarios con submenú */}
          {Superusuario === true ||
          Cargo === "Administrador" ||
          Usuarios === true ? (
            <div className="navA">
              <button
                type="button"
                className={`navA ${
                  location.pathname.startsWith("/Admin/Usuario") ? "active" : ""
                }`}
                onClick={toggleUserMenu}
              >
                <div className="Reportes">
                  <span className="material-symbols-outlined">
                    manage_accounts
                  </span>
                  <span> Usuarios</span>
                  <span className="material-symbols-outlined">
                    {isUserMenuOpen ? "expand_less" : "expand_more"}
                  </span>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="dropdown-menu">
                  <button
                    type="button"
                    className={`navA ${
                      location.pathname === "/Admin/Usuario" ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick("/Admin/Usuario")}
                  >
                    {" "}
                    <div className="Reportes">
                      <span>Activos</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`navA ${
                      location.pathname === "/Admin/Usuario/Inactivo"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleButtonClick("/Admin/Usuario/Inactivo")}
                  >
                    {" "}
                    <div className="Reportes">
                      <span>Inactivos</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`navA ${
                      location.pathname === "/Admin/Usuario/Perfil"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleButtonClick("/Admin/Usuario/Perfil")}
                  >
                    <div className="Reportes">
                      <span> Mi perfil</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className={`navA ${
                location.pathname === "/Admin/Usuario/Perfil" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("/Admin/Usuario/Perfil")}
            >
              <div className="Reportes">
                <span className="material-symbols-outlined">
                  <span class="material-symbols-outlined">person</span>
                </span>
                <span> Mi perfil</span>
              </div>
            </button>
          )}
        </div>
        <div className="Logout" onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          <p>Cerrar sesión</p>
        </div>
      </nav>
    </>
  );
};
