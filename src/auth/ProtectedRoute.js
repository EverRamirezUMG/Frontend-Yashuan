import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token"); // Suponiendo que guardas el token en localStorage

  const isTokenValid = () => {
    if (!token) return false; // El token no existe

    try {
      const decodedToken = jwt_decode(token); // Decodifica el token
      const currentTime = Date.now() / 1000; // Tiempo actual en segundos

      // Verifica si el token ha expirado
      return decodedToken.exp > currentTime;
    } catch (error) {
      console.error("Token inválido:", error);
      return false; // Si ocurre un error, el token es inválido
    }
  };

  return isTokenValid() ? element : <Navigate to="/Admin" />;
};

export default ProtectedRoute;
