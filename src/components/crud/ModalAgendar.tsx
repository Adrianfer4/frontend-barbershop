import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import Swal from "sweetalert2";

type ModalProps = {
  id_servicio: number;
  setMostrarModal: (mostrar: boolean) => void;
};

type Barbero = {
  id_usuario: number;
  nombre: string;
};

const ModalAgendar = ({ id_servicio, setMostrarModal }: ModalProps) => {
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [barbero, setBarbero] = useState("");
  const [fecha, setFecha] = useState(format(new Date(), "yyyy-MM-dd"));
  const [horarios, setHorarios] = useState<string[]>([]);
  const [hora, setHora] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/usuarios?rol=barbershop")
      .then((res) => res.json())
      .then(setBarberos);
  }, []);

  useEffect(() => {
    if (fecha && id_servicio && barbero) {
      fetch(
        `http://localhost:3000/api/citas/horarios?fecha=${fecha}&servicio=${id_servicio}&barbero=${barbero}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setHorarios(data);
          } else {
            console.warn("Formato inesperado:", data);
            setHorarios([]);
          }
        })
        .catch((err) => {
          console.error("Error al obtener horarios:", err);
          setHorarios([]);
        });
    } else {
      setHorarios([]);
    }
  }, [fecha, id_servicio, barbero]);

  const agendar = async () => {
    if (!barbero || !hora || !id_servicio) {
      return Swal.fire({
        icon: "warning",
        title: "Faltan campos",
        text: "Debes seleccionar un barbero y una hora disponible",
      });
    }

    const res = await fetch("http://localhost:3000/api/citas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: Number(barbero),
        servicio: Number(id_servicio),
        fecha,
        hora,
      }),
    });

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Cita agendada",
        text: "Tu cita fue registrada exitosamente",
      });
      setBarbero("");
      setHora("");
      setMostrarModal(false);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar la cita",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#c1cccf] p-6 rounded-2xl w-full max-w-md shadow-2xl border border-neutral-800 relative">
        <button
          onClick={() => setMostrarModal(false)}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-amber-500 text-center mb-6 uppercase tracking-wide">
          Agendar Cita
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-900">Barbero</label>
            <select
              className="w-full bg-gray-300 text-gray-900 border border-neutral-700 rounded-lg px-3 py-2"
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

          <div>
            <label className="block text-sm font-bold mb-1 text-gray-900">Fecha</label>
            <input
              type="date"
              className="w-full bg-gray-300 text-gray-900 font-bold border border-neutral-700 rounded-lg px-3 py-2"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              max={format(addDays(new Date(), 6), "yyyy-MM-dd")}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-gray-900">Horario disponible</label>
            <select
              className="w-full bg-gray-300 text-gray-900 border border-neutral-700 rounded-lg px-3 py-2"
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
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              onClick={agendar}
              className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:opacity-90 text-white font-bold px-4 py-2 rounded-lg transition"
            >
              Confirmar cita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAgendar;
