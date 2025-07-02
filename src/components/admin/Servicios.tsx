// src/pages/dashboard/Servicios.tsx
import { useEffect, useState } from "react";
import ModalServicio from "../crud/Modal";
import Swal from "sweetalert2";

interface Servicio {
  id_servicio: number;
  nombre_servicio: string;
  descripcion: string;
  precio: number;
  duracion: string;
  imagen?: string | File;
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
  const [imagen, setImagen] = useState<File | null>(null);

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

  useEffect(() => {
    if (!showModal) {
      setNombre("");
      setDescripcion("");
      setPrecio(0);
      setDuracion("");
      setImagen(null);
    }
  }, [showModal]);

  const convertirHoraAminutos = (duracion: string): string => {
    const [horas, minutos] = duracion.split(":").map(Number);
    return (horas * 60 + minutos).toString();
  };

  const abrirModalEdicion = (servicio: Servicio) => {
    const duracionMinutos = convertirHoraAminutos(servicio.duracion);
    setServicioEditado({ ...servicio, duracion: duracionMinutos });
    setShowEditModal(true);
  };

  // Convierte minutos a formato hh:mm:ss
  const convertirMinutosAFormatoHora = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:00`;
  };

  const handleCrearServicio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nombre_servicio", nombre);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio.toString());
      formData.append(
        "duracion",
        convertirMinutosAFormatoHora(parseInt(duracion))
      );

      if (imagen) formData.append("imagen", imagen);

      const res = await fetch("http://localhost:3000/api/servicios", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al crear servicio");

      await fetchServicios();

      // Limpiar campos y cerrar modal
      setNombre("");
      setDescripcion("");
      setPrecio(0);
      setDuracion("");
      setImagen(null);
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
      const formData = new FormData();
      formData.append("nombre_servicio", servicioEditado.nombre_servicio);
      formData.append("descripcion", servicioEditado.descripcion);
      formData.append("precio", servicioEditado.precio.toString());
      formData.append(
        "duracion",
        convertirMinutosAFormatoHora(parseInt(servicioEditado.duracion))
      );
      if (servicioEditado.imagen instanceof File) {
        formData.append("imagen", servicioEditado.imagen);
      }

      const res = await fetch(
        `http://localhost:3000/api/servicios/${servicioEditado.id_servicio}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Error al editar servicio");

      await fetchServicios();
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
    <div className="bg-gray-100 rounded-xl">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Servicios</h1>

        <table className="w-full bg-white table-auto border border-gray-300">
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
                  min="1"
                  placeholder="Precio"
                  value={precio}
                  onChange={(e) => setPrecio(Number(e.target.value))}
                  required
                  className="w-full border p-2 rounded pl-7"
                />
              </div>
              <input
                type="number"
                placeholder="Duración en minutos"
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                min={1}
                required
                className="w-full border p-2 rounded"
              />
              <label className="block w-full">
                <span className="text-sm font-medium text-gray-700">
                  Imagen del servicio
                </span>
                <div className="mt-1 flex items-center gap-4">
                  <label
                    htmlFor="imagen"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-white text-sm font-medium text-gray-600 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition duration-150"
                  >
                    📁 Subir imagen
                  </label>
                  <span className="text-sm text-gray-500 italic">
                    Formato JPG, PNG o WEBP
                  </span>
                </div>
                <input
                  id="imagen"
                  name="imagen"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImagen(file);
                  }}
                  className="hidden"
                />
                {imagen && (
                  <p className="mt-2 text-sm text-gray-500 italic">
                    Archivo seleccionado:{" "}
                    <span className="font-medium">{imagen.name}</span>
                  </p>
                )}
              </label>

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
                type="number"
                placeholder="Duración en minutos"
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
              <label className="block w-full">
                <span className="text-sm font-medium text-gray-700">
                  Imagen del servicio
                </span>
                <div className="mt-1 flex items-center gap-4">
                  <label
                    htmlFor="imagen"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-white text-sm font-medium text-gray-600 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition duration-150"
                  >
                    📁 Cambiar imagen
                  </label>
                  <span className="text-sm text-gray-500 italic">
                    Formato JPG, PNG o WEBP
                  </span>
                </div>
                <input
                  type="file"
                  id="imagen"
                  name="imagen"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setServicioEditado({ ...servicioEditado, imagen: file });
                    }
                  }}
                  className="hidden"
                />
                {typeof servicioEditado.imagen === "string" && (
                  <p className="mt-2 text-sm text-gray-500 italic">
                    Imagen actual:{" "}
                    <span className="font-medium">
                      {servicioEditado.imagen}
                    </span>
                  </p>
                )}

                {servicioEditado.imagen instanceof File && (
                  <p className="mt-2 text-sm text-gray-500 italic">
                    Nueva imagen:{" "}
                    <span className="font-medium">
                      {servicioEditado.imagen.name}
                    </span>
                  </p>
                )}
              </label>
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
