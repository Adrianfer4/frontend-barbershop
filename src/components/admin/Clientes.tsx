import { useEffect, useState } from "react";
import ModalCliente from "../crud/Modal";
import Swal from "sweetalert2";

interface Cliente {
  id_usuario: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  rol: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [clienteEditado, setClienteEditado] = useState<Cliente | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    rol: "cliente",
  });

  const fetchClientes = async () => {
    const res = await fetch("http://localhost:3000/api/usuarios");
    const data = await res.json();
    setClientes(data);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, password: "123456" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No se pudo crear el cliente");
      }

      setShowModal(false);
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        rol: "cliente",
      });
      fetchClientes();

      Swal.fire(
        "Éxito",
        data.message || "Cliente creado exitosamente.",
        "success"
      );
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al crear el cliente",
      });
    }
  };

  const handleEditar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteEditado) return;
    try {
      await fetch(
        `http://localhost:3000/api/usuarios/${clienteEditado.id_usuario}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clienteEditado),
        }
      );
      setShowEditModal(false);
      setClienteEditado(null);
      fetchClientes();
      Swal.fire("Actualizado", "Cliente modificado exitosamente", "success");
    } catch {
      Swal.fire("Error", "No se pudo actualizar el cliente", "error");
    }
  };

  const handleEliminar = (id: number) => {
    Swal.fire({
      title: "¿Eliminar cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`http://localhost:3000/api/usuarios/${id}`, {
          method: "DELETE",
        });
        fetchClientes();
        Swal.fire("Eliminado", "El cliente fue eliminado", "success");
      }
    });
  };

  return (
    <div className="p-4 bg-white  rounded-xl ">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Gestión de Clientes
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Apellido</th>
              <th className="border p-2">Teléfono</th>
              <th className="border p-2">Correo</th>
              <th className="border p-2">Rol</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No hay clientes disponibles.
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.id_usuario} className="text-center">
                  <td className="border p-2">{cliente.nombre}</td>
                  <td className="border p-2">{cliente.apellido}</td>
                  <td className="border p-2">{cliente.telefono}</td>
                  <td className="border p-2">{cliente.email}</td>
                  <td className="border p-2 capitalize">{cliente.rol}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => {
                        setClienteEditado(cliente);
                        setShowEditModal(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleEliminar(cliente.id_usuario)}
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

      {/* Modal Crear */}
      <button
        onClick={() => setShowModal(true)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Crear Cliente
      </button>

      {showModal && (
        <ModalCliente
          show={showModal}
          onClose={() => setShowModal(false)}
          title="Nuevo Cliente"
        >
          <form
            onSubmit={handleCrear}
            className="space-y-4  p-6 rounded-lg shadow-lg"
          >
            <input
              type="text"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={(e) =>
                setFormData({ ...formData, apellido: e.target.value })
              }
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="tel"
              placeholder="Teléfono"
              pattern="\d{10}"
              title="Debe tener 10 números"
              value={formData.telefono}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
              }
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Correo"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border p-2 rounded"
              required
            />
            <select
              value={formData.rol}
              onChange={(e) =>
                setFormData({ ...formData, rol: e.target.value })
              }
              className="w-full border p-2 rounded"
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Admin</option>
              <option value="barbershop">Barbershop</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
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
        </ModalCliente>
      )}

      {showEditModal && clienteEditado && (
        <ModalCliente
          show={true}
          onClose={() => setShowEditModal(false)}
          title="Editar Cliente"
        >
          <form
            onSubmit={handleEditar}
            className="space-y-4  p-6 rounded-lg shadow-lg"
          >
            <input
              type="text"
              value={clienteEditado.nombre}
              onChange={(e) =>
                setClienteEditado({
                  ...clienteEditado,
                  nombre: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="(Apellido)"
              value={clienteEditado.apellido}
              onChange={(e) =>
                setClienteEditado({
                  ...clienteEditado,
                  apellido: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="(telefono)"
              value={clienteEditado.telefono}
              onChange={(e) =>
                setClienteEditado({
                  ...clienteEditado,
                  telefono: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="email"
              value={clienteEditado.email}
              onChange={(e) =>
                setClienteEditado({
                  ...clienteEditado,
                  email: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
              required
            />
            <select
              value={clienteEditado.rol}
              onChange={(e) =>
                setClienteEditado({ ...clienteEditado, rol: e.target.value })
              }
              className="w-full border p-2 rounded"
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Admin</option>
              <option value="barbershop">Barbershop</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
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
        </ModalCliente>
      )}
    </div>
  );
}
