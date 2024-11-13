import jsPDF from "jspdf";
import "jspdf-autotable";
import PropTypes from "prop-types";
import React from "react";

const ReporteVentas = ({ data, head }) => {
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "legal",
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    });

    let contador = 0;

    const formatNumber = (number) => {
      return new Intl.NumberFormat("es-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(number);
    };

    const img = new Image();
    img.src = "https://i.imgur.com/GFXnM30.png";
    img.onload = () => {
      doc.addImage(img, "PNG", 20, 5, 40, 15);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      const pageWidthCenteredText = doc.internal.pageSize.getWidth();
      const centerXText = pageWidthCenteredText / 2;
      doc.text("Venta de café pergamino", centerXText, 15, {
        align: "center",
      });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      const today = new Date();
      const date = `${today.getDate()}/${
        today.getMonth() + 1
      }/${today.getFullYear()}`;
      doc.setFontSize(8);
      doc.text(
        `Generado: ${date} ${today.toLocaleTimeString()}`,
        340,
        15,
        "right"
      );
      doc.setFontSize(14);
      const pageWidth = doc.internal.pageSize.getWidth();
      const centerX = pageWidth / 2;

      const text0 = `Ventas realizadas: ${data.length}`;

      const totalSum = data.reduce(
        (sum, item) => sum + parseFloat(item.total),
        0
      );
      const text1 = `Total: Q. ${formatNumber(totalSum)}`;

      doc.text(text0, centerX, 20, { align: "center" });
      doc.text(text1, centerX, 25, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");

      const totalPageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const usableWidth = totalPageWidth - 2;
      const sectionWidth = usableWidth / 4;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Lavado: ${formatNumber(head.peso_lavado)} quintales`,
        margin,
        35
      );
      doc.text(
        `Honey: ${formatNumber(head.peso_honey)} quintales`,
        margin + sectionWidth,
        35
      );
      doc.text(
        `Natural: ${formatNumber(head.peso_natural)} quintales`,
        margin + 2 * sectionWidth,
        35
      );
      doc.text(
        `Total: ${formatNumber(head.peso_total)} quintales`,
        margin + 3 * sectionWidth,
        35
      );

      const tableColumn = [
        "No.",
        "ID venta",
        "Cliente",
        "Proceso",
        "Cantidad",
        "Anticipo",
        "Pago total",
        "Fecha",
        "Precio",
        "Responsable",
        "Observación",
      ];
      const tableRows = [];

      data.forEach((item) => {
        const rowData = [
          ++contador,
          item.id,
          item.nombre,
          item.proceso,
          item.pesoneto,
          `Q. ${formatNumber(item.anticipo)}`,
          `Q. ${formatNumber(item.total)}`,
          new Date(item.fecha)
            .toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ de /g, "/"),
          item.precio,

          item.usuario,
          item.observacion || "N/A",
        ];
        tableRows.push(rowData);
      });

      doc.autoTable({
        startY: 40,
        head: [tableColumn],
        body: tableRows,
        styles: { overflow: "linebreak" },
        columnStyles: {
          0: { cellWidth: "auto" },
          1: { cellWidth: "auto" },
          2: { cellWidth: 30 },
          3: { cellWidth: "auto" },
          4: { cellWidth: 25 },
          5: { cellWidth: "auto", halign: "center" },
          6: { cellWidth: "auto" },
          7: { cellWidth: 25 },
          8: { cellWidth: 32 },
          9: { cellWidth: 27 },
          10: { cellWidth: 32 },
          11: { cellWidth: "auto", halign: "center" },
          12: { cellWidth: 35 },
        },
        tableWidth: "auto",
      });

      const pdfName = `ResumenAcopio_${date}.pdf`;
      doc.save(pdfName);
      const pdfBlob = doc.output("blob", { filename: pdfName });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = pdfName;
      link.click();
      window.open(pdfUrl, "_blank");
    };

    img.onerror = () => {
      console.error("Error al cargar la imagen.");
    };
  };

  return (
    <div>
      <span
        style={{ cursor: "pointer" }}
        onClick={generatePDF}
        className="material-symbols-outlined"
      >
        print
      </span>
    </div>
  );
};

ReporteVentas.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      pk_comprobante: PropTypes.string,
      pk_productor: PropTypes.string,
      nombre: PropTypes.string,
      tipo: PropTypes.string,
      fecha: PropTypes.string,
      hora: PropTypes.string,
      preciobase: PropTypes.string,
      pesobruto: PropTypes.string,
      tara: PropTypes.string,
      pesoneto: PropTypes.string,
      flete: PropTypes.number,
      total: PropTypes.string,
      consignar: PropTypes.bool,
      observacion: PropTypes.string,
    })
  ),
};

export default ReporteVentas;
