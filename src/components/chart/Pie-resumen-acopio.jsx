import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieResumenAcopio({ data: datosAcopio }) {
  // Desestructuración y almacenamiento en una nueva variable
  let labels = datosAcopio || {}; // Asegúrate de que labels sea un objeto

  const Productores = Object.keys(labels);
  console.log(Productores);

  // Mapeo de valores a 0 si son nulos
  const compras = Object.values(labels).map((value) =>
    value === null ? 0 : value
  );

  // Verifica si hay datos para la gráfica
  const totalCompras = compras.reduce((acc, val) => acc + val, 0);

  // Datos y opciones de la gráfica
  let data, options;

  if (totalCompras === 0) {
    // Cuando no hay datos
    data = {
      labels: ["Sin compras"],
      datasets: [
        {
          data: [1], // Valor dummy para mostrar la gráfica
          backgroundColor: ["rgba(128, 128, 128, 0.25)"], // Color gris
          borderColor: ["rgba(128, 128, 128, 0.51)"],
          hoverOffset: 15,
          borderWidth: 5,
        },
      ],
    };
    options = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          display: true,
          labels: {
            color: "#5E5E5E",
            fontFamily: "Istok Web",
            fontStyle: "bold",
            padding: 30,
            usePointStyle: true,
          },
        },
        title: {
          display: false,
          text: "Total de café comprado de los productores",
          position: "bottom",
        },
        responsive: false,
      },
    };
  } else {
    // Cuando hay datos
    data = {
      labels: Productores,
      datasets: [
        {
          label: "qq",
          data: compras,
          backgroundColor: [
            "rgba(168, 193, 97, 0.5)",
            "rgba(255, 168, 0, 0.5)",
            "rgba(255, 0, 0, 0.5)",
            "rgba(0, 117, 255, 0.5)",
          ],
          borderColor: [
            "rgba(168, 193, 97, 1)",
            "rgba(255, 168, 0, 1)",
            "rgba(255, 0, 0, 1)",
            "rgba(0, 117, 255, 1)",
          ],
          hoverOffset: 15,
          borderWidth: 2,
        },
      ],
    };
    options = {
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "right",
          display: true,
          labels: {
            color: "#5E5E5E",
            fontFamily: "Istok Web",
            fontStyle: "bold",
            padding: 20,
            usePointStyle: true,
          },
        },
        title: {
          display: false,
          text: "Total de café comprado de los productores",
          position: "bottom",
        },
        responsive: true,
      },
    };
  }

  return (
    <div className="chart-container">
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default PieResumenAcopio;
