// import React from "react";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Doughnut } from "react-chartjs-2";

// ChartJS.register(ArcElement, Tooltip, Legend);

// function PiePergamino(pergamino) {
//   console.log(pergamino);

//   let labels = pergamino.data;

//   const Productores = Object.keys(labels);

//   const compras = Object.values(labels);

//   var options = {
//     maintainAspectRatio: true,
//     plugins: {
//       legend: {
//         position: "right",
//         display: true,
//         labels: {
//           color: "#5E5E5E",
//           FontFace: "Istok Web",
//           FontFaceSet: "bold",
//           padding: 20,
//           usePointStyle: true,
//         },
//       },
//       title: {
//         display: false,
//         text: "Total de cafe comprado de los productores",
//         position: "bottom",
//       },
//       responsive: false,
//       scales: {
//         x: 1,
//         y: 1,
//       },
//     },
//   };

//   var data = {
//     labels: Productores,
//     datasets: [
//       {
//         label: "Compra de cafè",
//         data: compras,
//         backgroundColor: [
//           "rgba(168, 193, 97, 0.5)",
//           "rgba(255, 168, 0, 0.5)",
//           "rgba(255, 0, 0, 0.5)",
//           "rgba(0, 117, 255, 0.5)",
//           "rgba(0, 138, 147,0.5)",
//         ],
//         borderColor: [
//           "rgba(168, 193, 97, 1)",
//           "rgba(255, 168, 0, 1)",
//           "rgba(255, 0, 0, 1)",
//           "rgba(0, 117, 255, 1)",
//           "rgba(0, 138, 147,0.7)",
//         ],
//         hoverOffset: 15,
//         borderwidth: 5,
//       },
//     ],
//   };

//   return (
//     <div>
//       <Doughnut data={data} options={options} />
//     </div>
//   );
// }

// export default PiePergamino;

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function PiePergamino(pergamino) {
  console.log(pergamino);

  let labels = pergamino.data;

  const Productores = Object.keys(labels);
  const compras = Object.values(labels);

  // Calcular el total de compras
  const total = compras.reduce((acc, compra) => acc + compra, 0);

  var options = {
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "right", // Posición de la leyenda
        display: true,
        labels: {
          color: "#5E5E5E",
          padding: 18,
          usePointStyle: true, // Puntos en lugar de cuadros
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels.map((label, index) => ({
              text: `${label}: ${data.datasets[0].data[index].toFixed(2)}`,
              fillStyle: data.datasets[0].backgroundColor[index],
              strokeStyle: data.datasets[0].borderColor[index],
              pointStyle: "rectRounded", // Estilo del punto
              hidden: false,
              index,
            }));
          },
        },
      },
      title: {
        display: false, // Mostrar el título personalizado
        text: `Total: ${total.toFixed(2)} Quintales`,
        position: "top",
        font: {
          size: 16,
        },
      },
    },
    responsive: true,
  };

  var data = {
    labels: Productores, // Etiquetas de los productores
    datasets: [
      {
        label: "Compra de cafè",
        data: compras,
        backgroundColor: [
          "rgba(168, 193, 97, 0.5)",
          "rgba(255, 168, 0, 0.5)",
          "rgba(255, 0, 0, 0.5)",
          "rgba(0, 117, 255, 0.5)",
          "rgba(0, 138, 147, 0.5)",
        ],
        borderColor: [
          "rgba(168, 193, 97, 1)",
          "rgba(255, 168, 0, 1)",
          "rgba(255, 0, 0, 1)",
          "rgba(0, 117, 255, 1)",
          "rgba(0, 138, 147, 1)",
        ],
        hoverOffset: 15,
        borderWidth: 2,
      },
    ],
  };

  return (
    // <div style={{ width: "100%", height: "100%" }}>
    <Doughnut data={data} options={options} />
    // </div>
  );
}

export default PiePergamino;
