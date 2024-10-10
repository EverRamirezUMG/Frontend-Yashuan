import { Line } from "react-chartjs-2";
import React from "react";
import moment from "moment";
import "moment/locale/es";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ChartDias(semana) {
  const ventas = semana.data;

  const venta = (ventas || []).map((item) => {
    const fecha = new Date(item.dia);
    const nombreDia = fecha.toLocaleDateString("es-ES", { weekday: "long" });
    return { dia: nombreDia, quintales: item.quintales };
  });

  const dias = venta.map((item) => item.dia);
  const ingresos = venta.map((item) => item.quintales);
  console.log(ingresos);
  moment.locale("es");

  var data = {
    labels: dias,
    datasets: [
      {
        label: "Gastos",
        data: dias,
        tension: 0.2,
        fill: true,
        backgroundColor: "rgba(200, 200, 225, 0.5)",
        borderColor: "rgba(200, 200, 250, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(100, 150, 200, 0.9)",
        pointBorderColor: "rgba(200, 200, 250, 1)",
      },
      {
        label: "Maduro ",
        data: ingresos,
        tension: 0.19,
        fill: true,
        backgroundColor: "rgba(20, 200, 225, 0.5)",
        borderColor: "rgba(20, 200, 250, 1)",
        pointRadius: 5,
        pointBackgroundColor: "rgba(20, 150, 200, 0.9)",
        pointBorderColor: "rgba(20, 200, 250, 1)",
      },
    ],
  };

  var options = {
    responsive: true, // La gráfica será responsiva
    maintainAspectRatio: false, // No mantener la proporción predeterminada
    plugins: {
      legend: {
        display: false, // Ocultar leyenda
      },
    },
    layout: {
      padding: 30, // Añadir padding al gráfico
    },
    scales: {
      y: {
        beginAtZero: true, // Escala en Y comienza en 0
      },
      x: {
        ticks: { color: "gray" }, // Personalización de los ticks en el eje X
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default ChartDias;
