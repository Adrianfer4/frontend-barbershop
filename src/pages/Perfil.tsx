import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaUserCircle } from "react-icons/fa";

type Usuario = {
  id_usuario: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  rol: string;
  foto_perfil?: string;
};

const Perfil = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const id = payload.id;

    fetch(`http://localhost:3000/api/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsuario(data);
        setEditForm({
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          email: data.email,
        });
      })
      .catch(() => Swal.fire("Error", "No se pudo cargar el perfil", "error"));
  }, []);

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    const token = localStorage.getItem("token");
    if (!archivo || !usuario || !token) return;

    const formData = new FormData();
    formData.append("foto", archivo);

    try {
      const res = await fetch(
        `http://localhost:3000/api/usuarios/${usuario.id_usuario}/foto`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        setUsuario({ ...usuario, foto_perfil: data.foto_perfil });
        Swal.fire("Foto actualizada", "Se ha subido correctamente", "success");
      } else {
        Swal.fire("Error", data.mensaje || "No se pudo subir la foto", "error");
      }
    } catch {
      Swal.fire("Error", "Hubo un error al subir la foto", "error");
    }
  };

  const handleActualizarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!usuario || !token) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/usuarios/${usuario.id_usuario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire("Guardado", "Perfil actualizado correctamente", "success");
    } catch {
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    }
  };

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!usuario || !token) return;

    if (passwordForm.nueva !== passwordForm.confirmar) {
      return Swal.fire("Error", "Las contraseñas no coinciden", "warning");
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/usuarios/${usuario.id_usuario}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            actual: passwordForm.actual,
            nueva: passwordForm.nueva,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire("Contraseña actualizada", "Se cambió correctamente", "success");
      setPasswordForm({ actual: "", nueva: "", confirmar: "" });
    } catch {
      Swal.fire("Error", "No se pudo cambiar la contraseña", "error");
    }
  };

  if (!usuario)
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-10 h-10 animate-spin text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <p className="text-sm text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-yellow-50 to-amber-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-full md:w-1/3 p-6 bg-amber-200 shadow-md flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-amber-100 shadow">
          {usuario.foto_perfil ? (
            <img
              src={`http://localhost:3000/uploads/usuarios/${usuario.foto_perfil}`}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUserCircle className="text-amber-500  w-32 h-32" />
          )}

          <label className="absolute bottom-0 w-full text-center bg-black/60 text-white text-xs cursor-pointer py-1 hover:bg-amber-600 transition">
            Cambiar
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFotoChange}
            />
          </label>
        </div>
        <h2 className="text-xl font-bold">
          {usuario.nombre} {usuario.apellido}
        </h2>
        <p className="text-sm">{usuario.email}</p>
        <p className="text-sm">📞 {usuario.telefono}</p>
        <span className="text-xs bg-amber-500 text-white px-3 py-1 rounded-full shadow">
          {usuario.rol}
        </span>
      </aside>

      {/* Formulario */}
      <main className="flex-1 p-6 space-y-10">
        <section>
          <h3 className="text-xl font-semibold mb-4 text-amber-700">
            Editar Perfil
          </h3>
          <form
            onSubmit={handleActualizarPerfil}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              className="p-2 border rounded-md"
              placeholder="Nombre"
              value={editForm.nombre}
              onChange={(e) =>
                setEditForm({ ...editForm, nombre: e.target.value })
              }
              required
            />
            <input
              type="text"
              className="p-2 border rounded-md"
              placeholder="Apellido"
              value={editForm.apellido}
              onChange={(e) =>
                setEditForm({ ...editForm, apellido: e.target.value })
              }
              required
            />
            <input
              type="text"
              className="p-2 border rounded-md"
              placeholder="Teléfono"
              value={editForm.telefono}
              onChange={(e) =>
                setEditForm({ ...editForm, telefono: e.target.value })
              }
              required
            />
            <input
              type="email"
              className="p-2 border rounded-md"
              placeholder="Correo electrónico"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              required
            />
            <div className="md:col-span-2">
              <button className="mt-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">
                Guardar Cambios
              </button>
            </div>
          </form>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 text-amber-700">
            Cambiar Contraseña
          </h3>
          <form
            onSubmit={handleCambiarPassword}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="password"
              className="p-2 border rounded-md"
              placeholder="Contraseña actual"
              value={passwordForm.actual}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, actual: e.target.value })
              }
              required
            />
            <input
              type="password"
              className="p-2 border rounded-md"
              placeholder="Nueva contraseña"
              value={passwordForm.nueva}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, nueva: e.target.value })
              }
              required
            />
            <input
              type="password"
              className="p-2 border rounded-md md:col-span-2"
              placeholder="Confirmar nueva contraseña"
              value={passwordForm.confirmar}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmar: e.target.value,
                })
              }
              required
            />
            <div className="md:col-span-2">
              <button className="mt-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">
                Cambiar Contraseña
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Perfil;
