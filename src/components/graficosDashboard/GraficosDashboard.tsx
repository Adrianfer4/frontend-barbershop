import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { useEffect, useState, useCallback } from "react";

const BASE_URL = "https://backend-barbershop-production-2f88.up.railway.app";
const API_BASE = `${BASE_URL}/api`;

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
);

type IngresoPorBarbero = {
  barbero: string;
  total: number;
};

export default function GraficosDashboard() {
  const [datosLine, setDatosLine] = useState<number[]>([]);
  const [datosPie, setDatosPie] = useState<{
    nombres: string[];
    valores: number[];
  }>({
    nombres: [],
    valores: [],
  });

  const token = localStorage.getItem("token");

  const cargarDatos = useCallback(async () => {
    try {
      // Pie (Ingresos por barberos)
      const resPie = await fetch(`${API_BASE}/ingresos/por-barbero`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resPie.ok) {
        console.error(`Error ${resPie.status}:`, await resPie.text());
        return;
      }

      const dataPie = (await resPie.json()) as IngresoPorBarbero[];

      if (!Array.isArray(dataPie)) {
        console.error("La respuesta no es un arreglo:", dataPie);
        return;
      }

      const nombres = dataPie.map((d) => d.barbero);
      const valores = dataPie.map((d) => d.total);

      setDatosPie({ nombres, valores });

      //Linea (Citas por dia)
      const resLine = await fetch(`${API_BASE}/citas/por-dia`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dataLine = (await resLine.json()) as number[];
      setDatosLine(dataLine);
    } catch (err) {
      console.error("Error al cargar gráficos", err);
    }
  }, [token]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const dataPastel = {
    labels: datosPie.nombres,
    datasets: [
      {
        label: "Porcentaje por barbero",
        data: datosPie.valores,
        backgroundColor: ["#facc15", "#4ade80", "#60a5fa", "#f97316"],
        borderWidth: 1,
      },
    ],
  };

  const dataLinea = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Citas por día",
        data: datosLine,
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.3)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* Gráfico de línea */}
      <div className="w-full md:w-2/3 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-bold text-gray-700 mb-2">
          Registro de citas
        </h3>
        <Line data={dataLinea} />
      </div>

      {/* Gráfico de pastel */}
      <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-bold text-gray-700 mb-2">
          Ingresos mensuales por barbero
        </h3>
        <div className="w-full max-w-[400px] mx-auto p-auto flex justify-center">
          <Pie data={dataPastel} />
        </div>
      </div>
    </div>
  );
}
