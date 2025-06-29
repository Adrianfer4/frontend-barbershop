import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type Cita = {
  id_cita: number;
  cliente_nombre: string;
  barbero_nombre: string;
  fecha: string;
  hora: string;
  servicio: string;
  nombre_servicio: string;
  estado: "pendiente" | "realizada" | "cancelada";
};

export default function Citas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [estadoFiltro, setEstadoFiltro] = useState<string>("");
  const [fechaFiltro, setFechaFiltro] = useState<string>("");

  const fetchCitas = async () => {
    try {
      const params = new URLSearchParams();
      if (estadoFiltro) params.append("estado", estadoFiltro);
      if (fechaFiltro) params.append("fecha", fechaFiltro);

      const token = localStorage.getItem("token"); // Asegúrate de que esté guardado al iniciar sesión

      const res = await fetch(
        `http://localhost:3000/api/citas/admin?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("Citas actualizadas:", data);
      setCitas(data);
    } catch (error) {
      console.error("Error al cargar citas:", error);
      Swal.fire("Error", "No se pudieron cargar las citas", "error");
    }
  };

  const cambiarEstado = async (id: number, nuevoEstado: Cita["estado"]) => {
    try {
      const res = await fetch(`http://localhost:3000/api/citas/${id}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error al cambiar estado");

      await fetchCitas();
      Swal.fire("Estado actualizado", "", "success");
    } catch {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const eliminarCita = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar esta cita?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await fetch(`http://localhost:3000/api/citas/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        await fetchCitas();
        Swal.fire("Eliminado", "La cita ha sido eliminada", "success");
      } catch {
        Swal.fire("Error", "No se pudo eliminar la cita", "error");
      }
    }
  };

  useEffect(() => {
    fetchCitas();
  }, [estadoFiltro, fechaFiltro]);

  const formatearFecha = (fechaIso: string) => {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const colorEstado = (estado: string) => {
    switch (estado) {
      case "realizada":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelada":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  return (
    <div className="p-4 bg-gray-100 shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Gestión de Citas</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <label className="flex items-center gap-2 text-sm">
          Estado:
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="realizada">Realizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          Fecha:
          <select
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todas</option>
            <option value="hoy">Hoy</option>
          </select>
        </label>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto max-w-full">
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Cliente</th>
              <th className="p-2 border">Barbero</th>
              <th className="p-2 border">Servicio</th>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Hora</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  No hay citas disponibles.
                </td>
              </tr>
            ) : (
              citas.map((cita) => (
                <tr key={cita.id_cita} className="text-center">
                  <td className="border p-2 break-words">
                    {cita.cliente_nombre}
                  </td>
                  <td className="border p-2 break-words">
                    {cita.barbero_nombre}
                  </td>
                  <td className="border p-2 break-words">
                    {cita.nombre_servicio}
                  </td>
                  <td className="border p-2">{formatearFecha(cita.fecha)}</td>
                  <td className="border p-2">{cita.hora}</td>
                  <td
                    className={`border p-2 capitalize ${colorEstado(
                      cita.estado
                    )}`}
                  >
                    {cita.estado}
                  </td>
                  <td className="border p-2 space-x-2">
                    <select
                      value={cita.estado}
                      onChange={(e) =>
                        cambiarEstado(
                          cita.id_cita,
                          e.target.value as Cita["estado"]
                        )
                      }
                      className={`border rounded px-2 py-1 text-sm ${colorEstado(
                        cita.estado
                      )}`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="realizada">Realizada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                    <button
                      onClick={() => eliminarCita(cita.id_cita)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
