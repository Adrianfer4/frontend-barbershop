import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const BASE_URL = "https://backend-barbershop-production-2f88.up.railway.app";
const API_BASE = `${BASE_URL}/api`;

interface Props {
  show: boolean;
  onClose: () => void;
  onSaved: () => void;
  barberos: { id_usuario: number; nombre: string }[];
  servicios: { id_servicio: number; nombre_servicio: string; precio: number }[];
  ingreso?: {
    id_cita: null;
    id_ingreso: number;
    id_barbero: number;
    id_servicio: number;
    monto: number;
    descripcion?: string;
  };
}

export default function IngresoModal({
  show,
  onClose,
  onSaved,
  barberos,
  servicios,
  ingreso,
}: Props) {
  const modoEdicion = Boolean(ingreso);

  const [form, setForm] = useState({
    id_cita: null,
    id_barbero: "",
    id_servicio: "",
    monto: "",
    descripcion: "",
  });

  useEffect(() => {
    if (ingreso) {
      setForm({
        id_cita: null,
        id_barbero: ingreso.id_barbero.toString(),
        id_servicio: ingreso.id_servicio.toString(),
        monto: ingreso.monto.toString(),
        descripcion: ingreso.descripcion || "",
      });
    } else {
      setForm({
        id_cita: null,
        id_barbero: "",
        id_servicio: "",
        monto: "",
        descripcion: "",
      });
    }
  }, [ingreso, show]);

  useEffect(() => {
    if (!modoEdicion && form.id_servicio) {
      const servicio = servicios.find(
        (s) => s.id_servicio === Number(form.id_servicio),
      );
      if (servicio) {
        const precioNumero = Number(servicio.precio);
        setForm((prev) => ({
          ...prev,
          monto: isNaN(precioNumero) ? "" : precioNumero.toFixed(2),
        }));
      }
    }
  }, [form.id_servicio, modoEdicion, servicios]);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const endpoint = modoEdicion
      ? `${API_BASE}/ingresos/${ingreso?.id_ingreso}`
      : `${API_BASE}/ingresos`;
    const method = modoEdicion ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_cita: form.id_cita,
          id_barbero: Number(form.id_barbero),
          id_servicio: Number(form.id_servicio),
          monto: Number(form.monto),
          descripcion: form.descripcion,
        }),
      });

      if (!res.ok) throw new Error();

      onSaved();
      onClose();
      Swal.fire(
        "Éxito",
        modoEdicion ? "Ingreso actualizado" : "Ingreso creado",
        "success",
      );
    } catch {
      Swal.fire("Error", "No se pudo guardar el ingreso", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#c1cccf] p-6 rounded-2xl w-full max-w-md shadow-2xl border border-neutral-800 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl font-bold transition"
        >
          ×
        </button>

        <h2
          className="text-2xl font-bold text-amber-500 text-center mb-6 uppercase tracking-wide"
          style={{ fontFamily: "'Russo One', sans-serif" }}
        >
          {modoEdicion ? "Editar Ingreso" : "Nuevo Ingreso"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-900">
              Barbero
            </label>
            <select
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={form.id_barbero}
              onChange={(e) => setForm({ ...form, id_barbero: e.target.value })}
              required
            >
              <option value="">Selecciona un barbero</option>
              {barberos.map((b) => (
                <option key={b.id_usuario} value={b.id_usuario}>
                  {b.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-gray-900">
              Servicio
            </label>
            <select
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={form.id_servicio}
              onChange={(e) =>
                setForm({ ...form, id_servicio: e.target.value })
              }
              required
            >
              <option value="">Selecciona un servicio</option>
              {servicios.map((s) => (
                <option key={s.id_servicio} value={s.id_servicio}>
                  {s.nombre_servicio}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-gray-900">
              Monto
            </label>
            <input
              type="number"
              step="0.01"
              value={form.monto}
              onChange={(e) => setForm({ ...form, monto: e.target.value })}
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-gray-900">
              Descripción adicional
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              placeholder="Ej. Corte con degradado y cejas"
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-80 text-white font-bold px-4 py-2 rounded-lg transition"
            >
              {modoEdicion ? "Guardar cambios" : "Crear ingreso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
