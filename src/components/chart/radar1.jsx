// // RadarChart.js
// import React from "react";
// import { Radar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   RadialLinearScale,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   RadialLinearScale
// );

// const RadarChart = () => {
//   // Datos para la gráfica de radar
//   const data = {
//     labels: [
//       "Aroma",
//       "Sabor",
//       "Posgusto",
//       "Acidez",
//       "Cuerpo",
//       "Balance",
//       "Apreciacion",
//     ],
//     datasets: [
//       {
//         label: "Datos de catacion",
//         backgroundColor: "rgba(255,99,132,0.2)",
//         borderColor: "rgba(255,99,132,1)",
//         pointBackgroundColor: "rgba(255,99,132,1)",
//         pointBorderColor: "#fff",
//         pointHoverBackgroundColor: "#fff",
//         pointHoverBorderColor: "rgba(255,99,132,1)",
//         data: [7, 7.3, 6.9, 8.3, 7.1, 5.9, 8.2], // Datos del segundo conjunto
//       },
//     ],
//   };

//   // Opciones para la gráfica de radar
//   const options = {
//     responsive: false,
//     scale: {
//       y: {
//         beginAtZero: true,
//       },
//       x: {
//         ticks: { color: "gray" },
//       },
//     },
//   };

//   return <Radar data={data} options={options} />;
// };

// export default RadarChart;

import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function RadarChart() {
  const data = {
    labels: [
      "Apreciacion",
      "Aroma",
      "Sabor",
      "Posgusto",
      "Acidez",
      "Cuerpo",
      "Balance",
    ],
    datasets: [
      {
        label: "Datos de catacion", // Este es el label de la leyenda que puedes ocultar
        data: [7, 7.3, 6.9, 8.3, 7.1, 5.9, 8.2],
        backgroundColor: "rgba(5, 122, 130, 0.30)",
        borderColor: "rgba(5, 122, 130, 0.75)",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false, // Permite ajustar al contenedor
    plugins: {
      legend: {
        display: false, // Oculta la leyenda
      },
      title: {
        display: false, // Oculta el título
      },
    },
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
  };

  return (
    // <div style={{ width: "100%", height: "250px" }}>
    //   {" "}
    //   {/* Ajusta el tamaño del div */}
    <Radar data={data} options={options} />
    // </div>
  );
}

export default RadarChart;
