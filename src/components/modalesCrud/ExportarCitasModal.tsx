import { useEffect, useState } from "react";
import { obtenerFechaHoy, isoToDateOnly } from "../../utils/formatoDeFechas";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_BASE = `${BASE_URL}/api`;

type Barbero = {
  id_usuario: number;
  nombre: string;
};

type Cita = {
  id_cita: number;
  cliente_nombre: string;
  barbero_nombre: string;
  fecha: string;
  hora: string;
  servicio: number;
  nombre_servicio: string;
  estado: "pendiente" | "realizada" | "cancelada";
  id_barbero: number;
};

type ExportarCitasModalProps = {
  mostrar: boolean;
  onClose: () => void;
  citas: Cita[];
  colorEstado: (estado: string) => string;
};

const ExportarCitasModal = ({
  mostrar,
  onClose,
  citas,
  colorEstado,
}: ExportarCitasModalProps) => {
  const [barberoSeleccionado, setBarberoSeleccionado] =
    useState<string>("todos");
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("");
  const [barberos, setBarberos] = useState<Barbero[]>([]);

  useEffect(() => {
    const obtenerBarberos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/usuarios?rol=barbershop`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setBarberos(data);
      } catch {
        Swal.fire("Error", "No se pudieron cargar los barberos", "error");
      }
    };

    if (mostrar) {
      obtenerBarberos();
      setFechaSeleccionada(obtenerFechaHoy());
    }
  }, [mostrar]);

  const generarPDF = (barberoId: number | "todos", fecha: string) => {
    if (!fecha) {
      Swal.fire("Selecciona una fecha", "", "warning");
      return;
    }

    onClose();

    let citasFiltradas = citas.filter((cita) => {
      const fechaCita = isoToDateOnly(cita.fecha);
      return fechaCita === fecha;
    });

    if (barberoId !== "todos") {
      citasFiltradas = citasFiltradas.filter(
        (cita) => cita.id_barbero === barberoId,
      );
    }

    if (citasFiltradas.length === 0) {
      Swal.fire({
        title: "No hay citas",
        text: `No hay citas para ${
          barberoId === "todos" ? "esa fecha" : "ese barbero en esa fecha"
        }`,
        icon: "info",
      });
      return;
    }

    const citasPorBarbero: { [key: string]: Cita[] } = {};

    citasFiltradas.forEach((cita) => {
      if (!citasPorBarbero[cita.barbero_nombre]) {
        citasPorBarbero[cita.barbero_nombre] = [];
      }
      citasPorBarbero[cita.barbero_nombre].push(cita);
    });

    const [year, month, day] = fecha.split("-").map(Number);
    const fechaReporte = new Date(year, month - 1, day);

    const fechaFormateada = fechaReporte.toLocaleDateString("es-EC", {
      timeZone: "America/Guayaquil",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Citas por Barbero</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            body { margin: 0; padding: 10px; }
            .page-break { page-break-after: always; }
          }
        </style>
      </head>
      <body class="bg-white p-4">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold">Reporte de Citas</h1>
          <p class="text-gray-600">Fecha: ${fechaFormateada}</p>
        </div>
    `;

    Object.keys(citasPorBarbero).forEach((barbero, index) => {
      htmlContent += `
        <div class="mb-8 ${index > 0 ? "page-break" : ""}">
          <h2 class="text-xl font-bold text-center mb-4">Barbero: ${barbero}</h2>
          <table class="w-full border border-gray-300 mb-4">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-2 border">Hora</th>
                <th class="p-2 border">Cliente</th>
                <th class="p-2 border">Servicio</th>
                <th class="p-2 border">Estado</th>
              </tr>
            </thead>
            <tbody>
      `;

      const citasOrdenadas = [...citasPorBarbero[barbero]].sort((a, b) =>
        a.hora.localeCompare(b.hora),
      );

      citasOrdenadas.forEach((cita) => {
        htmlContent += `
          <tr>
            <td class="p-2 border text-center">${cita.hora.substring(0, 5)}</td>
            <td class="p-2 border">${cita.cliente_nombre}</td>
            <td class="p-2 border">${cita.nombre_servicio}</td>
            <td class="p-2 border text-center capitalize ${colorEstado(
              cita.estado,
            ).replace("border-", "")}">${cita.estado}</td>
          </tr>
        `;
      });

      htmlContent += `
            </tbody>
          </table>
          <div class="mt-8 text-right">
            <p class="text-sm text-gray-500">Firma: _________________________</p>
          </div>
        </div>
      `;
    });

    htmlContent += `</body></html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  };

  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#c1cccf] p-6 rounded-2xl w-full max-w-md shadow-2xl border border-neutral-800 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl font-bold transition"
        >
          ×
        </button>

        <h1
          className="text-3xl uppercase text-amber-600 text-center font-semi-bold mb-6"
          style={{ fontFamily: "'Russo One', sans-serif" }}
        >
          Exportar Citas
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-gray-800">
            Selecciona un barbero
          </label>
          <select
            value={barberoSeleccionado}
            onChange={(e) => setBarberoSeleccionado(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="todos">Todos los barberos</option>
            {barberos.map((barbero) => (
              <option key={barbero.id_usuario} value={barbero.id_usuario}>
                {barbero.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1 text-gray-800">
            Selecciona una fecha
          </label>
          <input
            type="date"
            value={fechaSeleccionada}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() =>
              generarPDF(
                barberoSeleccionado === "todos"
                  ? "todos"
                  : parseInt(barberoSeleccionado),
                fechaSeleccionada,
              )
            }
            className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-80 text-white font-bold px-4 py-2 rounded-lg transition"
          >
            Generar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportarCitasModal;
