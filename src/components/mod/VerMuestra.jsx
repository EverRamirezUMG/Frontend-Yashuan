import React, { useState, useEffect } from "react";
import styled from "styled-components";
import swal from "sweetalert2";
import "./styles/IngresarMuestra.css";
import { useForm } from "react-hook-form";
import LogCatacion from "../../assets/Muestra01.png";

const VerMuestra = ({
  children,
  estado,
  cambiarEstado,
  idpartida,
  titulo,
  total,
  fecha,
  direccion,
}) => {
  return (
    <>
      {estado && (
        <Overlay>
          <ContenedorModal>
            <EncabezadoModal>
              <div className="encabezado-ingresar-muestra">
                <img src={LogCatacion} alt="logo" className="icono" />
                <h2>Muestra para: {titulo}</h2>
                <p>
                  {" "}
                  Enviado el {fecha} hacia {direccion}
                </p>
                <p></p>
                <p> Cantidad enviada: {total} Lbs.</p>
              </div>
            </EncabezadoModal>
            <BotonCerrar onClick={() => cambiarEstado(false)}>
              <span className="material-symbols-outlined">close</span>
            </BotonCerrar>
            {children}
          </ContenedorModal>
        </Overlay>
      )}
    </>
  );
};

export default VerMuestra;

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
  width: 450px;
  min-height: 100px;
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
