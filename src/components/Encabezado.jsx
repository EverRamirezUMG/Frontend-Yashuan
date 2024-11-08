import React from "react";
import "./Styles/Enc-escritorio.css";
import { useNavigate } from "react-router-dom";
import RemoverPermisos from "../auth/RemoverPermisos";
import logo from "../assets/logo.png";
import avatar from "../../public/IMG/AVATAR/avatar2.png";
export const Encabezado = ({ titulo }) => {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const imagen = localStorage.getItem("imagen");
  console.log(imagen);
  return (
    <>
      <div className="Bodydiv">
        <div className="header">
          <div className="info">
            <div className="modulo">
              <img src={logo} alt="logo" />
              <h2>{titulo}</h2>
            </div>
            <div className="usuario">
              <div className="Perfil">
                <img src={imagen ? imagen : avatar} />
                <h5>{username}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Encabezado;
