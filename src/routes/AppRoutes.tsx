import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/client/LoginPage";
import Register from "../pages/client/RegisterPage";
import RutaProtegidaAdmin from "../components/autentication/RutaProtegidaAdmin";
import ForgotPasswordForm from "../pages/client/ForgotPasswordForm";
import ResetPasswordForm from "../pages/client/ResetPasswordForm";
import Dashboard from "../pages/admin/dashboard";
import Home from "../pages/Home";
import Perfil from "../pages/Perfil";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />

        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />

        {/* Rutas protegidas para el administrador */}
        <Route
          path="/admin/dashboard"
          element={
            <RutaProtegidaAdmin>
              <Dashboard />
            </RutaProtegidaAdmin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
