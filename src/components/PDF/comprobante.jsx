// import React from "react";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// const Comprobante = ({ data }) => {
//   const handleGenerarPDF = () => {
//     const doc = new jsPDF({
//       orientation: "p",
//       unit: "mm",
//       format: [80, 165],
//       putOnlyUsedFonts: true,
//       floatPrecision: 16,
//     });

//     const img = new Image();
//     img.src = "https://i.imgur.com/GFXnM30.png";
//     img.onload = () => {
//       doc.addImage(img, "PNG", 20, 5, 40, 15);

//       doc.setFontSize(11);
//       doc.text("Compra de café maduro", 40, 25, null, null, "center");
//       doc.setFont("helvetica", "bold");
//       doc.text(`${data[0].pk_comprobante}`, 40, 30, null, null, "center");
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(10);
//       const fecha = new Date(data[0].fecha);
//       const opciones = {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       };
//       const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
//       doc.text(`${fechaFormateada}`, 40, 35, null, null, "center");
//       doc.text(`${data[0].hora}`, 40, 40, null, null, "center");

//       // Información del productor
//       doc.text(`Nombre: ${data[0].nombre}`, 10, 55);
//       doc.text(`ID: ${data[0].pk_productor}`, 10, 60);
//       doc.text(`Tipo: ${data[0].tipo}`, 10, 65);
//       doc.text(`Consignado: ${data[0].consignar ? "Sí" : "No"}`, 10, 70);
//       doc.text(`Precio del día: Q.${data[0].preciobase}`, 10, 75);

//       // Peso
//       doc.text("Datos de pesaje", 40, 85, "center");
//       const tableWidth = 65; // Ancho total de la tabla
//       const startX = (80 - tableWidth) / 2; // Centrar la tabla
//       doc.autoTable({
//         startY: 90,
//         startX: startX,
//         head: [["Peso bruto", "Tara", "Peso neto"]],
//         body: [
//           [`${data[0].pesobruto}`, `${data[0].tara}`, `${data[0].pesoneto}`],
//         ],
//         theme: "grid",
//         headStyles: {
//           fillColor: [220, 220, 220],
//           textColor: [0, 0, 0],
//           fontSize: 10,
//           halign: "center",
//         },
//         bodyStyles: {
//           fillColor: [255, 255, 255],
//           textColor: [50, 50, 50],
//           fontSize: 10,
//           halign: "center",
//         },
//         styles: {
//           cellPadding: 1,
//           fontSize: 10,
//           lineColor: [50, 50, 50, 0.4],
//           lineWidth: 0.1,
//         },
//         columnStyles: {
//           0: { cellWidth: 20 },
//           1: { cellWidth: 12 },
//           2: { cellWidth: 20 },
//         },
//       });
// const flete = (data[0].flete * -1).toFixed(2);
// doc.text(`Flete: - Q.${flete}`, 10, 110);
// doc.setFont("helvetica", "bold");
// const total = Number(data[0].total).toFixed(2);
// doc.text(`Total: Q. ${total}`, 40, 120, "center");
// doc.setFont("helvetica", "normal");

//       // Observación
//       doc.text(`Observación:`, 10, 130);
//       doc.text(`${data[0].observacion}`, 10, 135, { maxWidth: 70 }); // Ajustar el ancho máximo para saltos de línea

//       // Información adicional
//       doc.setFontSize(8);
//       doc.setFont("helvetica", "italic");
//       doc.setTextColor(169, 169, 169);
//       doc.text(
//         `Beneficio Yashuan, cantón Tzanchaj,
//         Santiago Atitlán, Salida a
//         San Pedro la Laguna.`,
//         40,
//         150,
//         "center"
//       );
//       doc.setTextColor(0, 0, 0);

//       // Guardar el PDF
//       doc.save(`comprobante-${data[0].nombre}.pdf`);
//     };

//     img.onerror = () => {
//       console.error("Error al cargar la imagen.");
//     };
//   };

//   return <button onClick={handleGenerarPDF}>Generar PDF</button>;
// };

// export default Comprobante;

import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Comprobante = ({ data }) => {
  const handleGenerarPDF = () => {
    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: [80, 165],
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    });

    const img = new Image();
    img.src = "https://i.imgur.com/GFXnM30.png";
    img.onload = () => {
      doc.addImage(img, "PNG", 20, 5, 40, 15);

      doc.setFontSize(11);
      doc.text("Compra de café maduro", 40, 25, null, null, "center");
      doc.setFont("helvetica", "bold");
      doc.text(`${data[0].pk_comprobante}`, 40, 30, null, null, "center");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const fecha = new Date(data[0].fecha);
      const opciones = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
      doc.text(`${fechaFormateada}`, 40, 35, null, null, "center");
      doc.text(`${data[0].hora}`, 40, 40, null, null, "center");

      // Información del productor
      doc.text(`Nombre: ${data[0].nombre}`, 10, 55);
      doc.text(`ID: ${data[0].pk_productor}`, 10, 60);
      doc.text(`Tipo: ${data[0].tipo}`, 10, 65);
      doc.text(`Consignado: ${data[0].consignar ? "Sí" : "No"}`, 10, 70);
      doc.text(`Precio del día: Q.${data[0].preciobase}`, 10, 75);

      // Peso
      doc.text("Datos de pesaje", 40, 85, null, null, "center");
      const tableWidth = 60; // Ancho total de la tabla
      const startX = (80 - tableWidth) / 2; // Centrar la tabla
      doc.autoTable({
        startY: 90,
        startX: startX,
        head: [["Peso bruto", "Tara", "Peso neto"]],
        body: [
          [`${data[0].pesobruto}`, `${data[0].tara}`, `${data[0].pesoneto}`],
        ],
        theme: "grid",
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontSize: 10,
          halign: "center",
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [50, 50, 50],
          fontSize: 10,
          halign: "center",
        },
        styles: {
          cellPadding: 1,
          fontSize: 10,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 12 },
          2: { cellWidth: 20 },
        },
      });

      const flete = (data[0].flete * -1).toFixed(2);
      doc.text(`Flete: - Q.${flete}`, 10, 110);
      doc.setFont("helvetica", "bold");
      const total = Number(data[0].total).toFixed(2);
      doc.text(`Total: Q. ${total}`, 40, 120, "center");
      doc.setFont("helvetica", "normal");

      // Observación
      doc.text(`Observación:`, 10, 130);
      const observacionX = 10; // Margen izquierdo
      const observacionY = 135; // Altura inicial
      const maxWidth = 70; // Ancho máximo para el texto de observación
      const observacionText = ` ${data[0].observacion}`;
      const lines = doc.splitTextToSize(observacionText, maxWidth); // Dividir texto en líneas
      doc.text(lines, observacionX, observacionY); // Ajustar texto a múltiples líneas

      // Información adicional
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(169, 169, 169);
      doc.text(
        `Beneficio Yashuan, cantón Tzanchaj,
        Santiago Atitlán, Salida a 
        San Pedro la Laguna.`,
        40,
        150,
        "center"
      );
      doc.setTextColor(0, 0, 0);

      // Guardar el PDF
      doc.save(`${data[0].pk_comprobante}-${data[0].nombre}.pdf`);
    };

    img.onerror = () => {
      console.error("Error al cargar la imagen.");
    };
  };

  return (
    <span onClick={handleGenerarPDF} class="material-symbols-outlined">
      print
    </span>
  );
};

export default Comprobante;
