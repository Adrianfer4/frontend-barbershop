import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Servicios from "../../components/admin/Servicios";

export default function Dashboard() {
  const [vista, setVista] = useState("dashboard");

  const renderVista = () => {
    switch (vista) {
      case "dashboard":
        return <div>Bienvenido al panel de control</div>;
        case "clientes":
        return <div>Componente Clientes</div>;
      case "servicios":
        return <Servicios />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout vistaActual={vista} onSeleccionarVista={setVista}>
      {renderVista()}
    </AdminLayout>
  );
}
