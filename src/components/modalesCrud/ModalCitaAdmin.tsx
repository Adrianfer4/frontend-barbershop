import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import Swal from "sweetalert2";

const API_BASE = 'https://backend-barbershop-production-2f88.up.railway.app/api';

type ModalCitaAdminProps = {
  cita?: {
    id_cita: number;
    id_barbero: number;
    fecha: string;
    hora: string;
    servicio: number;
  };
  setMostrarModal: (mostrar: boolean) => void;
  onGuardado: () => void;
};

type Barbero = {
  id_usuario: number;
  nombre: string;
};

type Servicio = {
  id_servicio: number;
  nombre_servicio: string;
};

const isoToDateInput = (isoString: string) => {
  return isoString.split('T')[0];
};

const ModalCitaAdmin = ({ cita, setMostrarModal, onGuardado }: ModalCitaAdminProps) => {
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [barbero, setBarbero] = useState<string>(cita?.id_barbero?.toString() ?? "");
  const [servicio, setServicio] = useState<string>(cita?.servicio?.toString() ?? "");
  const [fecha, setFecha] = useState<string>(
    cita?.fecha ? isoToDateInput(cita.fecha) : ""
  );
  const [horarios, setHorarios] = useState<string[]>([]);
  const [hora, setHora] = useState<string>(cita?.hora ?? "");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE}/usuarios?rol=barbershop`)
      .then((res) => res.json())
      .then(setBarberos);

    fetch(`${API_BASE}/servicios`)
      .then((res) => res.json())
      .then(setServicios);
  }, []);

  useEffect(() => {
    if (fecha && servicio && barbero) {
      fetch(
        `${API_BASE}/citas/horarios?fecha=${fecha}&servicio=${servicio}&barbero=${barbero}`
      )
        .then((res) => res.json())
        .then((data) => setHorarios(Array.isArray(data) ? data : []))
        .catch(() => setHorarios([]));
    } else {
      setHorarios([]);
    }
  }, [fecha, servicio, barbero]);

  const guardar = async () => {
    if (!barbero || !servicio || !fecha || !hora) {
      return Swal.fire("Faltan campos", "Completa todos los campos", "warning");
    }

    const url = cita
      ? `${API_BASE}/citas/${cita.id_cita}`
      : `${API_BASE}/citas`;

    const metodo = cita ? "PUT" : "POST";

    const body = cita
      ? {
          id_barbero: Number(barbero),
          fecha,
          hora,
          servicio: Number(servicio),
        }
      : {
          id_barbero: Number(barbero),
          fecha,
          hora,
          servicio: Number(servicio),
        };

    const res = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      Swal.fire(
        cita ? "Cita actualizada correctamente" : "Cita registrada exitosamente",
        "",
        "success"
      );
      setMostrarModal(false);
      onGuardado();
    } else {
      Swal.fire("Error", "No se pudo guardar la cita", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#c1cccf] p-6 rounded-2xl w-full max-w-md shadow-2xl border border-neutral-800 relative">
        <button
          onClick={() => setMostrarModal(false)}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl font-bold transition"
        >
          ×
        </button>

        <h1 className="text-3xl uppercase text-amber-600 text-center font-semi-bold mb-6"
        style={{ fontFamily: "'Russo One', sans-serif" }}>
          {cita ? "Editar Cita" : "Nueva Cita"}
        </h1>

        <div className="space-y-4">
          {/* Barbero */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-900">Barbero</label>
            <select
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={barbero}
              onChange={(e) => setBarbero(e.target.value)}
            >
              <option value="">Selecciona un barbero</option>
              {barberos.map((b) => (
                <option key={b.id_usuario} value={b.id_usuario}>
                  {b.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Servicio */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-900">Servicio</label>
            <select
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
            >
              <option value="">Selecciona un servicio</option>
              {servicios.map((s) => (
                <option key={s.id_servicio} value={s.id_servicio}>
                  {s.nombre_servicio}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-900">Fecha</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              max={format(addDays(new Date(), 6), "yyyy-MM-dd")}
            />
          </div>

          {/* Horario */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-900">Horario</label>
            <select
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            >
              <option value="">Selecciona una hora</option>
              {horarios.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setMostrarModal(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cancelar
            </button>
            <button
              onClick={guardar}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-80 text-white font-bold px-4 py-2 rounded-lg transition"
            >
              {cita ? "Guardar cambios" : "Crear cita"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCitaAdmin;
