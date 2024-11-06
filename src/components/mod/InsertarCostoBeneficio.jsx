import React from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

export const IngresarCostoBeneficio = ({
  children,
  estado,
  cambiarEstado,
  titulo,
}) => {
  const URL = import.meta.env.VITE_URL;
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    registrarGasto(data);
    Swal.fire({
      icon: "success",
      title: "Costo Beneficio insertado correctamente",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleCerrar = () => {
    Swal.fire({
      title: "¿Estás seguro de cerrar el modal?",
      showDenyButton: true,
      confirmButtonText: `Si`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Modal cerrado", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Modal no cerrado", "", "info");
      }
    });
  };

  const registrarGasto = async (data) => {
    console.log(data);
    try {
      const respuesta = await fetch(`${URL}costoproduccion/ingresar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (respuesta.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Costo Beneficio insertado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al insertar el Costo Beneficio",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <>
      <Overlay>
        <ContenedorModal>
          <EncabezadoModal>
            <h2>Insertar Costo Beneficio</h2>
            <BotonCerrar onClick={handleCerrar}>
              <span>X</span>
            </BotonCerrar>
          </EncabezadoModal>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Costo</label>
            <input type="text" name="beneficio" {...register("beneficio")} />
            <label>Beneficio</label>
            <input type="text" name="otros" {...register("otros")} />
            <button type="submit">Insertar</button>
          </form>
        </ContenedorModal>
      </Overlay>
    </>
  );
};

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
  width: 500px;
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
