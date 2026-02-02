import { Bar, Line, Pie } from "react-chartjs-2";
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
import { useMemo, useCallback } from "react";

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
  const formatearPeriodo = useCallback((periodo: string | number) => {
    if (filtro === "mes") {
      const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
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
  }, [filtro]);

  const labels = useMemo(
    () => totales.map((t) => formatearPeriodo(t.periodo)),
    [totales, formatearPeriodo] 
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

  const datosPorBarbero = useMemo(() => {
    const grupos: Record<string, number> = {};
    totales.forEach((ingreso) => {
      if (!grupos[ingreso.nombre]) {
        grupos[ingreso.nombre] = 0;
      }
      grupos[ingreso.nombre] += Number(ingreso.total);
    });
    return {
      labels: Object.keys(grupos),
      data: Object.values(grupos),
    };
  }, [totales]);

  return (
    <div className="space-y-6">
      {/* Gráficos de barras y línea */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold text-center mb-2">
            Ingresos Totales por Periodo
          </h3>
          <Bar data={data} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold text-center mb-2">
            Evolución de Ingresos en el Tiempo
          </h3>
          <Line data={data} options={{ responsive: true }} />
        </div>
      </div>

      {/* Gráfico de pastel */}
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold text-center mb-4">
          Distribución de Ingresos por Barbero
        </h3>
        <div className="max-w-xs mx-auto">
          <Pie
            data={{
              labels: datosPorBarbero.labels,
              datasets: [
                {
                  data: datosPorBarbero.data,
                  backgroundColor: safeColors.slice(
                    0,
                    datosPorBarbero.labels.length
                  ),
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>

      {/* Tabla de resumen */}
      {/* <div className="overflow-x-auto bg-white rounded shadow-md">
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Barbero</th>
              <th className="p-2 border">Periodo</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {totales.map((t, i) => (
              <tr key={i} className="text-center">
                <td className="p-2 border">{t.nombre}</td>
                <td className="p-2 border">{formatearPeriodo(t.periodo)}</td>
                <td className="p-2 border font-semibold">
                  ${Number(t.total).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold text-center">
              <td className="p-2 border" colSpan={2}>
                Total Filtrado:
              </td>
              <td className="p-2 border">
                $
                {totales
                  .reduce((acc, t) => acc + Number(t.total), 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div> */}
    </div>
  );
}
