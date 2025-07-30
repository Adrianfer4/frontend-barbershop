import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

type ModalProps = {
  id_servicio: number;
  setMostrarModal: (mostrar: boolean) => void;
};

type Barbero = {
  id_usuario: number;
  nombre: string;
  foto_perfil: string;
};

type JwtPayload = {
  id_usuario: number;
  rol: string;
};

const ModalAgendar = ({ id_servicio, setMostrarModal }: ModalProps) => {
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [barbero, setBarbero] = useState("");
  const [fecha, setFecha] = useState(format(new Date(), "yyyy-MM-dd"));
  const [horarios, setHorarios] = useState<string[]>([]);
  const [hora, setHora] = useState("");

  const token = localStorage.getItem("token");
  const usuarioLogueado = token ? (jwtDecode(token) as JwtPayload) : null;

  const navigate = useNavigate();

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
    if (!usuarioLogueado) {
      return Swal.fire({
        icon: "error",
        title: "No estás logueado",
        text: "Por favor inicia sesión para agendar una cita",
      }).then(() => {
        navigate("/login");
      });
    }

    if (!barbero || !hora || !id_servicio) {
      return Swal.fire({
        icon: "warning",
        title: "Faltan campos",
        text: "Debes seleccionar un barbero y una hora disponible",
      });
    }

    const res = await fetch("http://localhost:3000/api/citas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_barbero: Number(barbero),
        id_usuario: usuarioLogueado.id_usuario,
        servicio: Number(id_servicio),
        fecha,
        hora,
        estado: "pendiente",
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
      const error = await res.json();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.error || "No se pudo registrar la cita",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-[#c1cccf] p-6 rounded-2xl w-full max-w-md shadow-2xl border border-neutral-800 relative">
        <button
          onClick={() => setMostrarModal(false)}
          className="absolute top-3 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-yellow-600 text-center mb-6 uppercase tracking-wide font-[Bebas Neue]">
          Agendar Cita
        </h2>

        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <label className="block font-bold mb-1">Barbero</label>
            <div className="relative">
              <select
                className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={barbero}
                onChange={(e) => setBarbero(e.target.value)}
                onMouseOver={() => console.log("hover")}
              >
                <option value="">Selecciona un barbero</option>
                {barberos.map((b) => (
                  <option key={b.id_usuario} value={b.id_usuario}>
                    {b.nombre}
                  </option>
                ))}
              </select>

              {barbero && (
                <div className="absolute bottom-15 left-0 mt-2 w-20 h-20 z-10 border border-amber-600 bg-white rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={`http://localhost:3000/uploads/usuarios/${
                      barberos.find((b) => b.id_usuario === Number(barbero))
                        ?.foto_perfil
                    }`}
                    alt="Foto del barbero"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Fecha</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              max={format(addDays(new Date(), 6), "yyyy-MM-dd")}
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Horario disponible</label>
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
              onClick={agendar}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-80 text-white font-bold px-4 py-2 rounded-lg transition"
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
