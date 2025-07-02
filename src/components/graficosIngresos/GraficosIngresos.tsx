import {
  Bar,
  Line,
  Pie
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

type IngresoAgrupado = {
  nombre: string;
  total: number;
  periodo: string | number;
};

type Props = {
  totales: IngresoAgrupado[];
  filtro: "dia" | "semana" | "mes" | "año";
};

export default function GraficosIngresos({ totales, filtro }: Props) {
  const formatearPeriodo = (periodo: string | number) => {
    if (filtro === "mes") {
      const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      const num = Number(periodo);
      return meses[num - 1] || `Mes ${periodo}`;
    }
    if (filtro === "año") return `Año ${periodo}`;
    if (filtro === "semana") return `Semana ${periodo}`;
    if (filtro === "dia") {
      try {
        const fecha = new Date(String(periodo));
        return fecha.toLocaleDateString("es-EC", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch {
        return String(periodo);
      }
    }
    return String(periodo);
  };

  const labels = useMemo(
    () => totales.map((t) => formatearPeriodo(t.periodo)),
    [totales, filtro]
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Ingresos",
        data: totales.map((t) => t.total),
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const safeColors = [
    "rgb(255, 99, 132)",    
    "rgb(54, 162, 235)",    
    "rgb(255, 206, 86)",    
    "rgb(75, 192, 192)",    
    "rgb(153, 102, 255)",   
    "rgb(255, 159, 64)",    
    "rgb(102, 217, 232)",   
    "rgb(180, 248, 200)",   
  ];

  return (
    <div className="space-y-8">
      {/* Fila con 2 gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-center mb-2">Ingresos totales por periodo</h3>
          <Bar data={data} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-center mb-2">Evolución de ingresos en el tiempo</h3>
          <Line data={data} options={{ responsive: true }} />
        </div>
      </div>

      {/* Fila con gráfico de pastel */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold text-center mb-2">Distribución de ingresos por barbero</h3>
        <div className="max-w-[300px] mx-auto">
          <Pie
            data={{
              labels: totales.map((t) => t.nombre),
              datasets: [
                {
                  data: totales.map((t) => t.total),
                  backgroundColor: safeColors, 
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border text-sm">
          <thead style={{ backgroundColor: "#f3f3f3", color: "#000" }}>
            <tr>
              <th className="p-2 border">Barbero</th>
              <th className="p-2 border">Periodo</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {totales.map((t, i) => (
              <tr key={i} className="text-center">
                <td className="border p-2">{t.nombre}</td>
                <td className="border p-2">{formatearPeriodo(t.periodo)}</td>
                <td className="border p-2 font-semibold">
                  ${Number(t.total).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td className="text-right p-2" colSpan={2}>
                Total filtrado:
              </td>
              <td className=" p-2">
                ${totales.reduce((acc, t) => acc + Number(t.total), 0).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}