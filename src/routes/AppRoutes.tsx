import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/LoginPage";
import Register from "../pages/RegisterPage";
import ForgotPasswordForm from "../pages/ForgotPasswordForm";
import ResetPasswordForm from "../pages/ResetPasswordForm";
import Dashboard from "../pages/admin/dashboard";
// import Clientes from "../pages/admin/clientes";
// import Servicios from "../pages/admin/servicios";
import Servicios from "../pages/dashboard/Servicios";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />
        {/* <Route path="/admin/clientes" element={<Clientes />} />
        <Route path="/admin/servicios" element={<Servicios />} /> */}

        <Route path="/dashboard/servicios" element={<Servicios />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
