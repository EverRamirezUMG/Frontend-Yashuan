import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import Usuario from "./pages/usuario";
import { Acopio } from "./pages/Acopio";
import { Registrarse } from "./pages/Registrarse";
import { HomeWeb } from "./pages/HomeWeb";
import UsuarioInactivo from "./pages/usuariosInactivos";
import Rendimiento from "./pages/Rendimiento";
import Temporada from "./pages/Temporada";
import NotFound from "./pages/NotFound";
import MiPerfil from "./pages/MiPerfil";
import Resumen from "./pages/Resumen";
import Productores from "./pages/Productores";
import Inventario from "./pages/Inventario";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeWeb />} />
          <Route path="/Admin" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/Registrarse" element={<Registrarse />} />
          <Route path="/Admin/Inicio" element={<Inicio />} />
          <Route path="/Admin/Inicio/Rendimiento" element={<Rendimiento />} />
          <Route path="/Admin/Inicio/Temporada" element={<Temporada />} />
          <Route path="/Admin/Acopio" element={<Acopio />} />
          <Route path="/Admin/Acopio/Resumen" element={<Resumen />} />
          <Route path="/Admin/Acopio/Productores" element={<Productores />} />
          <Route path="/Admin/Inventario" element={<Inventario />} />
          <Route path="/Admin/Usuario" element={<Usuario />} />
          <Route path="/Admin/Usuario/Inactivo" element={<UsuarioInactivo />} />
          <Route path="/Admin/Usuario/Perfil" element={<MiPerfil />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
