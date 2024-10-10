const URL = import.meta.env.VITE_URL;

async function PermisoUsuario() {
  const token = localStorage.getItem("token");
  const codigo = localStorage.getItem("codigo");

  try {
    const response = await fetch(`${URL}permiso/${codigo}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener permisos");
    }

    const permisoUsuario = await response.json();
    console.log(permisoUsuario);
    localStorage.setItem("analisis", permisoUsuario.analisis);
    localStorage.setItem("rendimiento", permisoUsuario.rendimiento);
    localStorage.setItem("resumentemporada", permisoUsuario.resumentemporada);
    localStorage.setItem("inventario", permisoUsuario.inventario);
    localStorage.setItem("compra", permisoUsuario.compra);
    localStorage.setItem("productores", permisoUsuario.productores);
    localStorage.setItem("resumen", permisoUsuario.resumen);
    localStorage.setItem("venta", permisoUsuario.venta);
    localStorage.setItem("muestra", permisoUsuario.muestra);
    localStorage.setItem("cliente", permisoUsuario.cliente);
    localStorage.setItem("envio", permisoUsuario.envio);
    localStorage.setItem("costoproduccion", permisoUsuario.costoproduccion);
    localStorage.setItem("usuarios", permisoUsuario.usuarios);
    localStorage.setItem("paginweb", permisoUsuario.paginaweb);

    return permisoUsuario; // Retorna los datos obtenidos
  } catch (error) {
    console.error(error);
    return null; // Retorna null en caso de error
  }
}

export default PermisoUsuario;
