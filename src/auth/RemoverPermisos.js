function RemoverPermisos() {
  // Elimina el token del localStorage (o sessionStorage)
  localStorage.removeItem("usuarios");
  localStorage.removeItem("compra");
  localStorage.removeItem("resumen");
  localStorage.removeItem("productores");
  localStorage.removeItem("venta");
  localStorage.removeItem("muestra");
  localStorage.removeItem("cliente");
  localStorage.removeItem("envio");
  localStorage.removeItem("inventario");
  localStorage.removeItem("analisis");
  localStorage.removeItem("rendimiento");
  localStorage.removeItem("resumentemporada");
  localStorage.removeItem("costoproduccion");
  localStorage.removeItem("paginweb");
}
export default RemoverPermisos;
