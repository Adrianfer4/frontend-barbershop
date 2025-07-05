import { useEffect, useState } from "react";
import CardEstadistica from "./CardEstadistica";
import { FaUsers, FaCalendarAlt, FaDollarSign, FaHandScissors } from "react-icons/fa";

export default function TarjetasDashboard() {
  const [clientes, setClientes] = useState(0);
  const [servicios, setServicios] = useState(0);
  const [citas, setCitas] = useState(0);
  const [ingresos, setIngresos] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTotales();
  }, []);

  const fetchTotales = async () => {
    try {
      const [resClientes, resServicios, resCitas, resIngresos] = await Promise.all([
        fetch("http://localhost:3000/api/usuarios/contar", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:3000/api/servicios/contar", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:3000/api/citas/contar", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:3000/api/ingresos/total", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const totalClientes = await resClientes.json();
      const totalServicios = await resServicios.json();
      const totalCitas = await resCitas.json();
      const totalIngresos = await resIngresos.json();

      setClientes(totalClientes.total);
      setServicios(totalServicios.total);
      setCitas(totalCitas.total);
      setIngresos(totalIngresos.total);
    } catch (error) {
      console.error("Error al cargar totales:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
      <CardEstadistica
        titulo="Clientes"
        valor={clientes}
        icono={<FaUsers />}
        color="bg-orange-500"
      />
      <CardEstadistica
        titulo="Servicios"
        valor={servicios}
        icono={<FaHandScissors />}
        color="bg-blue-500"
      />
      <CardEstadistica
        titulo="Citas"
        valor={citas}
        icono={<FaCalendarAlt />}
        color="bg-green-500"
      />
      <CardEstadistica
        titulo="Ingresos"
        valor={"$" + ingresos}
        icono={<FaDollarSign />}
        color="bg-yellow-500"
      />
    </div>
  );
}
