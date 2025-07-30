import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ModalCitaAdmin from "../modalesCrud/ModalCitaAdmin";
import ExportarCitasModal from "../modalesCrud/ExportarCitasModal";

type Cita = {
  id_cita: number;
  cliente_nombre: string;
  barbero_nombre: string;
  fecha: string;
  hora: string;
  servicio: number;
  nombre_servicio: string;
  estado: "pendiente" | "realizada" | "cancelada";
  id_barbero: number;
};

export default function Citas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [citaEditar, setCitaEditar] = useState<Cita | null>(null);
  const [mostrarModalExportar, setMostrarModalExportar] = useState(false);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const citasPorPagina = 10;
  const totalPaginas = Math.ceil(citas.length / citasPorPagina);
  const citasActuales = citas.slice(
    (paginaActual - 1) * citasPorPagina,
    paginaActual * citasPorPagina
  );

  const fetchCitas = async () => {
    try {
      const params = new URLSearchParams();
      if (estadoFiltro) params.append("estado", estadoFiltro);
      if (fechaFiltro) params.append("fecha", fechaFiltro);

      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/citas/admin?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setCitas(data);
      setPaginaActual(1); // Reset paginación al cambiar filtro
    } catch {
      Swal.fire("Error", "No se pudieron cargar las citas", "error");
    }
  };

  const cambiarEstado = async (id: number, nuevoEstado: Cita["estado"]) => {
    try {
      await fetch(`http://localhost:3000/api/citas/${id}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

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

  const abrirModalEditar = (cita: Cita) => {
    setCitaEditar(cita);
    setMostrarModalEditar(true);
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
      <div className="grid grid-cols-3 md:grid-cols-3 items-center mb-6">
        <div></div> {/* Izquierda vacía */}
        <h1
          className="text-3xl uppercase text-amber-600 text-center font-semi-bold "
          style={{ fontFamily: "'Russo One', sans-serif" }}
        >
          Gestión de Citas
        </h1>
        <div className="text-right">
          <button
            onClick={() => setMostrarModalExportar(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm transition"
          >
            Exportar Citas
          </button>
        </div>
      </div>

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
      <div className="overflow-x-auto max-w-full bg-white">
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
            {citasActuales.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  No hay citas disponibles.
                </td>
              </tr>
            ) : (
              citasActuales.map((cita) => (
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
                      onClick={() => abrirModalEditar(cita)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>

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

      {/* Paginacion */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Anterior
        </button>

        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            onClick={() => setPaginaActual(i + 1)}
            className={`px-3 py-1 rounded ${
              paginaActual === i + 1
                ? "bg-amber-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
          }
          disabled={paginaActual === totalPaginas}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 transition"
        >
          Siguiente
        </button>
      </div>

        <button
          onClick={() => setMostrarModalCrear(true)}
          className="fixed bottom-8 right-6 bg-amber-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-amber-700 z-50 transition"
        >
          + Crear Cita
        </button>

      {/* Modales */}
      {mostrarModalCrear && (
        <ModalCitaAdmin
          setMostrarModal={setMostrarModalCrear}
          onGuardado={fetchCitas}
        />
      )}

      {mostrarModalEditar && citaEditar && (
        <ModalCitaAdmin
          cita={citaEditar}
          setMostrarModal={(mostrar) => {
            setMostrarModalEditar(mostrar);
            if (!mostrar) setCitaEditar(null);
          }}
          onGuardado={fetchCitas}
        />
      )}

      <ExportarCitasModal
        mostrar={mostrarModalExportar}
        onClose={() => setMostrarModalExportar(false)}
        citas={citas}
        colorEstado={colorEstado}
      />
    </div>
  );
}
