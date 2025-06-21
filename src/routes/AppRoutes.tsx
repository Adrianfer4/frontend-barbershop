import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/client/LoginPage";
import Register from "../pages/client/RegisterPage";
import ForgotPasswordForm from "../pages/client/ForgotPasswordForm";
import ResetPasswordForm from "../pages/client/ResetPasswordForm";
import Dashboard from "../pages/admin/dashboard";
import Home from "../pages/Home";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />

        <Route path="/" element={<Home />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
