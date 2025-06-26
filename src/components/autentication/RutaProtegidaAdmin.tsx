import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type Props = {
  children: React.ReactNode;
};

type JwtPayload = {
  id: number;
  rol: string;
  exp: number;
};

const RutaProtegidaAdmin = ({ children }: Props) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token) as JwtPayload;

    // Expiración del token
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    // Verificar rol
    if (decoded.rol !== "admin") {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

export default RutaProtegidaAdmin;
