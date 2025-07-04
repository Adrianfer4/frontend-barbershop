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
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");

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
    setClientesFiltrados(data);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const buscarClientes = () => {
    const texto = busqueda.toLowerCase();

    const resultado = clientes.filter((c) => {
      const coincideTexto =
        c.nombre.toLowerCase().includes(texto) ||
        c.apellido.toLowerCase().includes(texto) ||
        c.email.toLowerCase().includes(texto);

      const coincideRol = filtroRol === "todos" || c.rol === filtroRol;

      return coincideTexto && coincideRol;
    });

    setClientesFiltrados(resultado);
  };

  useEffect(() => {
    buscarClientes();
  }, [filtroRol]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buscarClientes();
    }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, password: "123456" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      Swal.fire("Éxito", data.message, "success");
      setShowModal(false);
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        rol: "cliente",
      });
      fetchClientes();
    } catch {
      Swal.fire("Error", "Hubo un problema al crear el cliente", "error");
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
      Swal.fire("Actualizado", "Cliente actualizado", "success");
      setShowEditModal(false);
      setClienteEditado(null);
      fetchClientes();
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
        Swal.fire("Eliminado", "El cliente fue eliminado", "success");
        fetchClientes();
      }
    });
  };

  return (
    <div className="p-4 bg-gray-100 shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Gestión de Clientes
      </h1>

      {/* Buscador y filtro */}
      <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o correo"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border px-3 py-1 rounded flex-1"
        />
        <select
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="todos">Todos</option>
          <option value="cliente">Cliente</option>
          <option value="admin">Admin</option>
          <option value="barbershop">Barbershop</option>
        </select>
        <button
          onClick={buscarClientes}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white">
        <table className="w-full bg-white table-auto border border-gray-300 text-sm">
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
            {clientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No hay resultados.
                </td>
              </tr>
            ) : (
              clientesFiltrados.map((cliente) => (
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

      {/* Botón Crear Cliente */}
      <button
        onClick={() => setShowModal(true)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Crear Cliente
      </button>

      {/* Modal Crear */}
      {showModal && (
        <ModalCliente
          show={showModal}
          onClose={() => setShowModal(false)}
          title="Nuevo Cliente"
        >
          <form
            onSubmit={handleCrear}
            className="space-y-4 p-6 rounded-lg shadow-lg bg-white/50"
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
              title="Debe tener 10 dígitos"
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

      {/* Modal Editar */}
      {showEditModal && clienteEditado && (
        <ModalCliente
          show={true}
          onClose={() => setShowEditModal(false)}
          title="Editar Cliente"
        >
          <form
            onSubmit={handleEditar}
            className="space-y-4 p-6 rounded-lg shadow-lg bg-white/50"
          >
            <input
              type="text"
              value={clienteEditado.nombre}
              onChange={(e) =>
                setClienteEditado({ ...clienteEditado, nombre: e.target.value })
              }
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
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
              type="tel"
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
                setClienteEditado({ ...clienteEditado, email: e.target.value })
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
