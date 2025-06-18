// src/pages/dashboard/Servicios.tsx
import { useEffect, useState } from "react";
import ModalServicio from "../ui/Modal";
import Swal from "sweetalert2";

interface Servicio {
  id_servicio: number;
  nombre_servicio: string;
  descripcion: string;
  precio: number;
  duracion: string;
}

export default function Servicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [servicioEditado, setServicioEditado] = useState<Servicio | null>(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [duracion, setDuracion] = useState("");

  const abrirModalEdicion = (servicio: Servicio) => {
    setServicioEditado(servicio);
    setShowEditModal(true);
  };

  const fetchServicios = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/servicios");
      const data = await res.json();
      setServicios(data);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const handleCrearServicio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/servicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_servicio: nombre,
          descripcion,
          precio,
          duracion,
        }),
      });

      if (!res.ok) throw new Error("Error al crear servicio");

      await fetchServicios();

      // Limpiar campos y cerrar modal
      setNombre("");
      setDescripcion("");
      setPrecio(0);
      setDuracion("");
      setShowModal(false);
      Swal.fire({
        icon: "success",
        title: "Servicio creado",
        text: "El nuevo servicio fue registrado correctamente",
      });
    } catch (err) {
      console.error("Error creando servicio:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al crear el servicio",
      });
    }
  };

  const handleEditarServicio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicioEditado) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/servicios/${servicioEditado.id_servicio}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(servicioEditado),
        }
      );

      if (!res.ok) throw new Error("Error al editar servicio");

      // Refrescar la lista completa
      const actualizados = await fetch(
        "http://localhost:3000/api/servicios"
      ).then((res) => res.json());
      setServicios(actualizados);
      setShowEditModal(false);
      setServicioEditado(null);
      Swal.fire({
        icon: "success",
        title: "Servicio actualizado",
        text: "Los cambios se guardaron correctamente",
      });
    } catch (err) {
      console.error("Error editando servicio:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el servicio",
      });
    }
  };

  const handleEliminarServicio = (id: number) => {
    Swal.fire({
      title: "¿Eliminar servicio?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:3000/api/servicios/${id}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error("Error al eliminar servicio");
          setServicios((prev) => prev.filter((s) => s.id_servicio !== id));

          Swal.fire("¡Eliminado!", "El servicio ha sido eliminado.", "success");
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error("Error eliminando servicio:", err.message);
          } else {
            Swal.fire("Error", "No se pudo eliminar el servicio.", "error");
          }
        }
      }
    });
  };

  return (
    <div className="bg-gray-100">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Servicios</h1>

        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Descripción</th>
              <th className="p-2 border">Precio</th>
              <th className="p-2 border">Duración</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((servicio) => (
              <tr key={servicio.id_servicio} className="text-center">
                <td className="p-2 border">{servicio.nombre_servicio}</td>
                <td className="p-2 border">{servicio.descripcion}</td>
                <td className="p-2 border">${servicio.precio}</td>
                <td className="p-2 border">{servicio.duracion}</td>
                <td className="p-2 border">
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => abrirModalEdicion(servicio)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleEliminarServicio(servicio.id_servicio)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Crear */}
      <button
        onClick={() => setShowModal(true)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Crear Servicio
      </button>

        {/* Modal para crear servicio */}
        {showModal && (
          <ModalServicio
            show={showModal}
            onClose={() => setShowModal(false)}
            title="Nuevo Servicio"
          >
            <form
              onSubmit={handleCrearServicio}
              className="space-y-4  p-6 rounded-lg shadow-lg"
            >
              <input
                type="text"
                placeholder="Nombre del servicio"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Descripción del servicio"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Precio"
                  value={precio}
                  onChange={(e) => setPrecio(Number(e.target.value))}
                  required
                  className="w-full border p-2 rounded pl-7"
                />
              </div>
              <input
                type="time"
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </ModalServicio>
        )}

        {showEditModal && servicioEditado && (
          <ModalServicio
            show={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setServicioEditado(null);
            }}
            title="Editar Servicio"
          >
            <form
              onSubmit={handleEditarServicio}
              className="space-y-4 p-6 rounded-lg shadow-lg"
            >
              <input
                type="text"
                placeholder="Nombre del servicio"
                value={servicioEditado.nombre_servicio}
                onChange={(e) =>
                  setServicioEditado({
                    ...servicioEditado,
                    nombre_servicio: e.target.value,
                  })
                }
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="(descripción)"
                value={servicioEditado.descripcion}
                onChange={(e) =>
                  setServicioEditado({
                    ...servicioEditado,
                    descripcion: e.target.value,
                  })
                }
                required
                className="w-full border p-2 rounded"
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={servicioEditado.precio}
                  onChange={(e) =>
                    setServicioEditado({
                      ...servicioEditado,
                      precio: parseFloat(e.target.value),
                    })
                  }
                  required
                  className="w-full border p-2 rounded pl-7"
                />
              </div>
              <input
                type="time"
                value={servicioEditado.duracion}
                onChange={(e) =>
                  setServicioEditado({
                    ...servicioEditado,
                    duracion: e.target.value,
                  })
                }
                required
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setServicioEditado(null);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </ModalServicio>
        )}
      </div>
    </div>
  );
}
