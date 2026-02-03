import { useEffect, useState, useCallback } from "react";
import ModalCliente from "../modalesCrud/Modal";
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

  {
    /*Paginacion */
  }
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const clientesPaginados = clientesFiltrados.slice(indiceInicio, indiceFin);

  const totalPaginas = Math.ceil(clientesFiltrados.length / elementosPorPagina);

  const fetchClientes = async () => {
    const res = await fetch("https://backend-barbershop-production-2f88.up.railway.app/api/usuarios");
    const data = await res.json();
    setClientes(data);
    setClientesFiltrados(data);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const buscarClientes = useCallback(() => {
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
}, [busqueda, filtroRol, clientes]); 

  useEffect(() => {
    buscarClientes();
    setPaginaActual(1);
  }, [buscarClientes]);  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buscarClientes();
    }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://backend-barbershop-production-2f88.up.railway.app/api/usuarios", {
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
        `https://backend-barbershop-production-2f88.up.railway.app/api/usuarios/${clienteEditado.id_usuario}`,
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
        await fetch(`https://backend-barbershop-production-2f88.up.railway.app/api/usuarios/${id}`, {
          method: "DELETE",
        });
        Swal.fire("Eliminado", "El cliente fue eliminado", "success");
        fetchClientes();
      }
    });
  };

  return (
    <div className="p-4 bg-gray-100 shadow rounded-xl">
      <h1
        className="text-3xl uppercase text-amber-600 text-center font-semi-bold mb-6"
        style={{ fontFamily: "'Russo One', sans-serif" }}
      >
        Gestión de Usuarios
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
          <option value="barbershop">Barbero</option>
        </select>
        <button
          onClick={buscarClientes}
          className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
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
              clientesPaginados.map((cliente) => (
                <tr key={cliente.id_usuario} className="text-center">
                  <td className="border p-2">{cliente.nombre}</td>
                  <td className="border p-2">{cliente.apellido}</td>
                  <td className="border p-2">{cliente.telefono}</td>
                  <td className="border p-2">{cliente.email}</td>
                  <td className="border p-2 capitalize">{cliente.rol}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      className="text-blue-600 hover:underline transition"
                      onClick={() => {
                        setClienteEditado(cliente);
                        setShowEditModal(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:underline transition"
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

      {/* Paginacion */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 transition"
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
                : "bg-gray-200 hover:bg-gray-300 transition"
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

      {/* Botón Crear Cliente */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-6 bg-amber-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-amber-700 z-50 transition"
      >
        + Crear Usuario
      </button>

      {/* Modal Crear */}
      {showModal && (
        <ModalCliente
          show={showModal}
          onClose={() => setShowModal(false)}
          title="Nuevo Usuario"
        >
          <form
            onSubmit={handleCrear}
            className="space-y-4 "
          >
            <label className="block text-sm font-bold mb-1 text-gray-900">Nombre</label>
            <input
              type="text"
              placeholder="Ingrese su Nombre"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <label className="block text-sm font-bold mb-1 text-gray-900">Apellido</label>
            <input
              type="text"
              placeholder="Ingrese su Apellido"
              value={formData.apellido}
              onChange={(e) =>
                setFormData({ ...formData, apellido: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <label className="block text-sm font-bold mb-1 text-gray-900">Telefono</label>
            <input
              type="tel"
              placeholder="Ingrese su Teléfono"
              pattern="\d{10}"
              title="Debe tener 10 dígitos"
              value={formData.telefono}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <label className="block text-sm font-bold mb-1 text-gray-900">Correo</label>
            <input
              type="email"
              placeholder="Ingrese su Correo"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <label className="block text-sm font-bold mb-1 text-gray-900">Tipo de Usuario</label>
            <select
              value={formData.rol}
              onChange={(e) =>
                setFormData({ ...formData, rol: e.target.value })
              }className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Admin</option>
              <option value="barbershop">Barbero</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-80 text-white font-bold px-4 py-2 rounded-lg transition"
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
          title="Editar Usuario"
        >
          <form
            onSubmit={handleEditar}
            className="space-y-4 "
          >
            <label className="block text-sm font-bold mb-1 text-gray-900">Nombre</label>
            <input
              type="text"
              value={clienteEditado.nombre}
              onChange={(e) =>
                setClienteEditado({ ...clienteEditado, nombre: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <label className="block text-sm font-bold mb-1 text-gray-900">Apellido</label>
            <input
              type="text"
              value={clienteEditado.apellido}
              onChange={(e) =>
                setClienteEditado({
                  ...clienteEditado,
                  apellido: e.target.value,
                })
              }
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <label className="block text-sm font-bold mb-1 text-gray-900">Telefono</label>
            <input
              type="tel"
              value={clienteEditado.telefono}
              onChange={(e) =>
                setClienteEditado({
                  ...clienteEditado,
                  telefono: e.target.value,
                })
              }
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <label className="block text-sm font-bold mb-1 text-gray-900">Correo</label>
            <input
              type="email"
              value={clienteEditado.email}
              onChange={(e) =>
                setClienteEditado({ ...clienteEditado, email: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <label className="block text-sm font-bold mb-1 text-gray-900">Tipo de Usuario</label>
            <select
              value={clienteEditado.rol}
              onChange={(e) =>
                setClienteEditado({ ...clienteEditado, rol: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Admin</option>
              <option value="barbershop">Barbershop</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-80 text-white font-bold px-4 py-2 rounded-lg transition"
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
