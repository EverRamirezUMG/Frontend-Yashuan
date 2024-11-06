import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarCatacion = ({ datos }) => {
  // Desestructuración y almacenamiento en una nueva variable
  let labels = datos || {}; // Asegúrate de que labels sea un objeto

  const nota = Object.keys(labels);

  // Mapeo de valores a 0 si son nulos
  const valor = Object.values(labels).map((value) =>
    value === null ? 0 : value
  );

  const data = {
    labels: nota,
    datasets: [
      {
        label: "Nota",
        data: valor,
        backgroundColor: "rgba(5, 122, 130, 0.30)",
        borderColor: "rgba(5, 122, 130, 0.75)",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 10,
        pointLabels: {
          fontSize: 12,
        },
      },
    },
  };

  return (
    <div className="radar-container">
      <div className="radar-chart">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
};

export default RadarCatacion;
