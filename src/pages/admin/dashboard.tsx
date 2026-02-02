import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Servicios from "../../components/admin/Servicios";
import Clientes from "../../components/admin/Clientes";
import Citas from "../../components/admin/Citas";
import Ingresos from "../../components/admin/Ingresos";
import DashboardAdmin from "../../components/admin/DashboardAdmin";

export default function Dashboard() {
  const [vista, setVista] = useState("dashboard");

  const renderVista = () => {
    switch (vista) {
      case "dashboard":
        return <DashboardAdmin />;
      case "usuarios":
        return <Clientes />;
      case "servicios":
        return <Servicios />;
      case "citas":
        return <Citas />;
        case "ingresos":
        return <Ingresos />;
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
