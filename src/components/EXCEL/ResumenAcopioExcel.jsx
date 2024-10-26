import React from "react";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";

const ExcelGenerator = ({ data, head }) => {
  const generateExcel = () => {
    const worksheetData = [];

    // Agregar encabezados
    const headers = [
      "No.",
      "Código",
      "Nombre",
      "Tipo",
      "Fecha",
      "Precio Base",
      "Peso Neto",
      "Flete",
      "Costo",
      "Comprobante",
      "Consignado",
      "Observación",
    ];
    worksheetData.push(headers);

    // Agregar datos
    data.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.pk_productor,
        item.nombre,
        item.tipo,
        item.fecha.split("T")[0],
        item.preciobase,
        item.pesoneto,
        item.flete !== null ? item.flete.toFixed(2) : "0.00",
        item.total,
        item.pk_comprobante,
        item.consignar ? "Sí" : "No",
        item.observacion || "N/A",
      ];
      worksheetData.push(rowData);
    });

    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // Generar el archivo Excel
    const excelName = `ResumenAcopio_${new Date().toLocaleDateString()}.xlsx`;
    XLSX.writeFile(workbook, excelName);
  };

  return (
    <div>
      <span
        style={{ cursor: "pointer" }}
        onClick={generateExcel}
        className="material-symbols-outlined"
      >
        description
      </span>
    </div>
  );
};

ExcelGenerator.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      pk_comprobante: PropTypes.string,
      pk_productor: PropTypes.string,
      nombre: PropTypes.string,
      tipo: PropTypes.string,
      fecha: PropTypes.string,
      preciobase: PropTypes.string,
      pesoneto: PropTypes.string,
      flete: PropTypes.number,
      total: PropTypes.string,
      consignar: PropTypes.bool,
      observacion: PropTypes.string,
    })
  ).isRequired,
  head: PropTypes.shape({
    partida: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    encargado: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    compras: PropTypes.number,
    productores: PropTypes.number,
    costo: PropTypes.number,
    compra: PropTypes.number,
    consignado: PropTypes.number,
    recolector: PropTypes.number,
    total: PropTypes.number,
  }).isRequired,
};

export default ExcelGenerator;
