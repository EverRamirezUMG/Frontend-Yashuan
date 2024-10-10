import React from "react";
import "./Styles/NavBarWEB.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export const NavBarWEB = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="BodydivWEB">
        <div className="headerWEB">
          <div className="infoWEB">
            <div className="moduloWEB">
              <img src={logo} alt="logo" onClick={() => navigate("/Admin")} />
            </div>
            <div className="paginaWEB">
              <button className="paginaBT"> Inicio </button>
              <button className="paginaBT"> ¿Quienes somos?</button>
              <button className="paginaBT"> contactenos </button>
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
