import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const GenerarEnvio = ({ data }) => {
  const handleGenerarPDF = () => {
    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: [216, 279], // Tamaño carta
      putOnlyUsedFonts: true,
      floatPrecision: 16,
      margins: { top: 20, right: 40, bottom: 20, left: 40 },
    });

    const img = new Image();
    img.src = "https://i.imgur.com/GFXnM30.png";
    img.onload = () => {
      doc.addImage(img, "PNG", 20, 10, 60, 22);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Envío de producto", 200, 23, null, null, "right");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`${data.id}`, 200, 30, null, null, "right");
      doc.setFontSize(10);
      const fecha = new Date(data.fecha);
      const opciones = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
      doc.text(fechaFormateada, 200, 35, null, null, "right");

      // Información del productor
      doc.setFontSize(14);
      doc.text(`Cliente: ${data.cliente}`, 20, 55);
      doc.text(`Destino: ${data.destino}`, 20, 65);
      doc.text(`Dirección: ${data.lugar}`, 20, 75);

      // Peso
      doc.setFontSize(14);
      doc.text("Datos del café", 108, 95, null, null, "center");
      const tableWidth = 216 - 40; // Ancho total de la tabla respetando los márgenes (40 de cada lado)
      const startX = 50; // Iniciar la tabla en el margen izquierdo
      doc.autoTable({
        startY: 100,
        margin: { left: (doc.internal.pageSize.getWidth() - tableWidth) / 2 },
        head: [["Tipo café", "Bultos", "Peso bruto", "Tara", "Peso neto"]],
        body: [
          [
            `Pergamino`,
            `${Number(data.tara) ? (Number(data.tara) * 100).toFixed(0) : "0"}`,
            `${Number(data.bruto) ? Number(data.bruto).toFixed(2) : "0.00"}`,
            `${Number(data.tara) ? Number(data.tara).toFixed(2) : "0.00"}`,
            `${Number(data.neto) ? Number(data.neto).toFixed(2) : "0.00"}`,
          ],
        ],
        theme: "grid",
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontSize: 14,
          halign: "center",
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [50, 50, 50],
          fontSize: 14,
          halign: "center",
        },
        styles: {
          cellPadding: 1,
          fontSize: 14,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
        },
        columnStyles: {
          0: { cellWidth: tableWidth * 0.25 },
          1: { cellWidth: tableWidth * 0.15 },
          2: { cellWidth: tableWidth * 0.2 },
          3: { cellWidth: tableWidth * 0.15 },
          4: { cellWidth: tableWidth * 0.25 },
        },
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`Total: ${data.neto} Quintales`, 108, 125, "center");
      doc.setFont("helvetica", "normal");

      doc.setFontSize(14);
      doc.text(`Piloto: ${data.piloto}`, 20, 140);
      doc.text(`Licencia: ${data.licencia}`, 20, 150);
      doc.text(`Placas: ${data.placa}`, 20, 160);

      //--------------firmas----------------

      doc.setFontSize(12);
      doc.line(20, 200, 80, 200);
      doc.text("Firma del Administrador", 30, 205);
      doc.setFontSize(10);
      doc.text("Tel: (+502) 40635822", 30, 210);
      doc.text("German Esteban Ramírez C.", 25, 215);
      doc.setFontSize(12);
      doc.line(80, 245, 138, 245);
      doc.text("Firma del cliente", 93, 250);
      doc.line(140, 200, 196, 200);
      doc.text("Firma del piloto", 157, 205);

      // Información adicional
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(169, 169, 169);
      doc.text(
        `Beneficio Yashuan, cantón Tzanchaj, Santiago Atitlán, 
              Salida a San Pedro la Laguna.`,
        110,
        265,
        "center"
      );
      doc.setTextColor(0, 0, 0);

      // Guardar el PDF
      doc.save(`${data.id}-${data.cliente}.pdf`);
      // Abrir el PDF en una nueva ventana del navegador
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    };

    img.onerror = () => {
      console.error("Error al cargar la imagen.");
    };
  };

  return (
    <>
      <button style={{ cursor: "pointer" }} onClick={handleGenerarPDF}>
        Imprimir
      </button>
    </>
  );
};

export default GenerarEnvio;
