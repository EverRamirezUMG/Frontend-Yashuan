import jsPDF from "jspdf";
import "jspdf-autotable";
import PropTypes from "prop-types";
import React from "react";

const PDFGenerator = ({ data, head }) => {
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
      doc.text("Compra de café maduro", centerXText, 15, {
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
      doc.setFontSize(10);
      const pageWidth = doc.internal.pageSize.getWidth();
      const centerX = pageWidth / 2;

      const text0 = `Partida: #${
        Array.isArray(head.partida)
          ? head.partida.map((p) => p.partida).join(", #")
          : head.partida
      }`;
      const text1 = `Encargado: ${
        Array.isArray(head.encargado)
          ? head.encargado.map((p) => p.usuario).join(", ")
          : head.encargado
      }`;
      const text2 = `Compras realizadas: ${head.compras}`;
      const text3 = `Productores atendidos: ${head.productores}`;
      const text4 = `Costo estimado: Q. ${formatNumber(head.costo)}`;

      const text5 = `Costo real: Q. ${formatNumber(head.pago)}`;

      doc.text(text0, centerX, 20, { align: "center" });
      doc.text(text1, centerX, 25, { align: "center" });
      doc.text(text2, centerX, 30, { align: "center" });
      doc.text(text3, centerX, 35, { align: "center" });
      doc.text(text4, centerX, 40, { align: "center" });
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(text5, centerX, 45, { align: "center" });

      const totalPageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const usableWidth = totalPageWidth - 2;
      const sectionWidth = usableWidth / 4;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Compra: ${formatNumber(head.compra)} quintales`, margin, 55);
      doc.text(
        `Consignado: ${formatNumber(head.consignado)} quintales`,
        margin + sectionWidth,
        55
      );
      doc.text(
        `Recolectado: ${formatNumber(head.recolector)} quintales`,
        margin + 2 * sectionWidth,
        55
      );
      doc.text(
        `Total: ${formatNumber(head.total)} quintales`,
        margin + 3 * sectionWidth,
        55
      );

      const tableColumn = [
        "No.",
        "Codigo",
        "Nombre",
        "Tipo",
        "Fecha",
        "Precio Base",
        "Peso Neto",
        "Flete",
        "Costo",
        "Comprobante",
        "Pago",
        "Consigado",
        "Observación",
      ];
      const tableRows = [];

      data.forEach((item) => {
        const rowData = [
          ++contador,
          item.pk_productor,
          item.nombre,
          item.tipo,
          new Date(item.fecha)
            .toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ de /g, "/"),
          item.preciobase,
          item.pesoneto,
          item.flete !== null ? `Q. ${item.flete.toFixed(2)}` : "Q. 0.00",
          `Q. ${formatNumber(item.total)}`,
          item.pk_comprobante,
          `Q. ${formatNumber(item.pago)}`,
          item.consignar ? "Sí" : "No",
          item.observacion || "N/A",
        ];
        tableRows.push(rowData);
      });

      doc.autoTable({
        startY: 60,
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

PDFGenerator.propTypes = {
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

export default PDFGenerator;
