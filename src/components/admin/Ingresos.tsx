import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type Ingreso = {
  id_ingreso: number;
  id_barbero: number;
  nombre_barbero: string;
  id_servicio: number;
  nombre_servicio: string;
  monto: number;
  fecha: string;
};

type IngresoAgrupado = {
  id_barbero: number;
  nombre: string;
  total: number;
  periodo: string | number;
};

export default function Ingresos() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [barberos, setBarberos] = useState<
    { id_usuario: number; nombre: string }[]
  >([]);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState("");
  const [totales, setTotales] = useState<IngresoAgrupado[]>([]);
  const [filtro, setFiltro] = useState<"dia" | "semana" | "mes" | "año">("dia");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const fetchBarberos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/usuarios/barberos");
      const data = await res.json();
      setBarberos(data);
    } catch (error) {
      console.error("Error al cargar barberos:", error);
    }
  };

  const fetchIngresos = async () => {
    try {
      const params = new URLSearchParams();
      if (desde) params.append("desde", desde);
      if (hasta) params.append("hasta", hasta);
      if (barberoSeleccionado) params.append("id_barbero", barberoSeleccionado);

      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/ingresos?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: Ingreso[] = await res.json();
      setIngresos(data);
    } catch (error) {
      console.error("Error al cargar ingresos:", error);
      Swal.fire("Error", "No se pudieron cargar los ingresos", "error");
    }
  };

  const cargarTotalesAgrupados = async (
    f: "dia" | "semana" | "mes" | "año",
    año?: string,
    mes?: string,
    dia?: string
  ) => {
    try {
      setFiltro(f);
      const params = new URLSearchParams({ filtro: f });
      if (año) params.append("año", año);
      if (mes) params.append("mes", mes);
      if (dia) params.append("dia", dia);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/ingresos/agrupado?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data: IngresoAgrupado[] = await res.json();
      setTotales(data);
    } catch (error) {
      console.error("Error al cargar ingresos agrupados:", error);
      Swal.fire(
        "Error",
        "No se pudieron cargar los ingresos agrupados",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchBarberos();
    cargarTotalesAgrupados(filtro);
  }, []);

  useEffect(() => {
    if (desde && hasta && new Date(hasta) < new Date(desde)) {
      Swal.fire("Error", "'Hasta' no puede ser antes que 'Desde'", "error");
      return;
    }
    fetchIngresos();
  }, [desde, hasta, barberoSeleccionado]);

  const formatearFecha = (fecha: string) => {
    if (!fecha || !fecha.includes("-")) return "Fecha no válida";
    const partes = fecha.split("T")[0].split("-");
    if (partes.length < 3) return "Fecha incompleta";
    const [año, mes, dia] = partes;
    const date = new Date(Number(año), Number(mes) - 1, Number(dia));
    if (isNaN(date.getTime())) return "Fecha inválida";
    return date.toLocaleDateString("es-EC", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const obtenerPeriodoLegible = (periodo: string | number): string => {
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
      return meses[Number(periodo) - 1] || `Mes ${periodo}`;
    }
    if (filtro === "dia") return formatearFecha(String(periodo));
    if (filtro === "año") return `Año ${periodo}`;
    if (filtro === "semana") return `Semana ${periodo}`;
    return String(periodo);
  };

  useEffect(() => {
    if (
      (filtro === "mes" && selectedMonth) ||
      (filtro === "año" && selectedYear) ||
      (filtro === "dia" && selectedDay)
    ) {
      cargarTotalesAgrupados(filtro, selectedYear, selectedMonth, selectedDay);
    }
  }, [selectedDay, selectedMonth, selectedYear, filtro]);

  const totalGeneral = ingresos.reduce((acc, i) => acc + Number(i.monto), 0);

  const totalFiltrado = totales.reduce((acc, t) => acc + Number(t.total), 0);

  return (
    <div className="p-4 bg-gray-100 shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Ingresos</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <label className="flex items-center gap-2 text-sm">
          Desde:
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          Hasta:
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          Barbero:
          <select
            value={barberoSeleccionado}
            onChange={(e) => setBarberoSeleccionado(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todos</option>
            {barberos.map((b) => (
              <option key={b.id_usuario} value={b.id_usuario}>
                {b.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          Agrupar por:
          <select
            value={filtro}
            onChange={(e) => {
              const nuevoFiltro = e.target.value as
                | "dia"
                | "semana"
                | "mes"
                | "año";
              setFiltro(nuevoFiltro);
              cargarTotalesAgrupados(
                nuevoFiltro,
                selectedYear,
                selectedMonth,
                selectedDay
              );
            }}
            className="border rounded px-2 py-1"
          >
            <option value="dia">Día</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
            <option value="año">Año</option>
          </select>
        </label>

        {filtro === "año"&& (
          
            <label className="flex items-center gap-2 text-sm">
              Año:
              <select
                value={selectedYear}
                onChange={(e) => {
                  const año = e.target.value;
                  setSelectedYear(año);
                  cargarTotalesAgrupados(filtro, año, selectedMonth);
                }}
                className="border rounded px-2 py-1"
              >
                <option value="">Todos</option>
                {[2025, 2026, 2027, 2028, 2029, 2030].map((año) => (
                  <option key={año} value={año}>
                    {año}
                  </option>
                ))}
              </select>
            </label>
)}
            {filtro === "mes" && (
              <label className="flex items-center gap-2 text-sm">
                Mes:
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    const mes = e.target.value;
                    setSelectedMonth(mes);
                    cargarTotalesAgrupados(filtro, selectedYear, mes);
                  }}
                  className="border rounded px-2 py-1"
                >
                  <option value="">Todos</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {new Date(0, m - 1).toLocaleString("es-EC", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {filtro === "dia" && (
              <label className="flex items-center gap-2 text-sm">
                Día de la semana:
                <select
                  value={selectedDay}
                  onChange={(e) => {
                    const dia = e.target.value;
                    setSelectedDay(dia);
                    cargarTotalesAgrupados(
                      "dia",
                      selectedYear,
                      selectedMonth,
                      dia
                    );
                  }}
                  className="border rounded px-2 py-1"
                >
                  <option value="">Todos</option>
                  <option value="Monday">Lunes</option>
                  <option value="Tuesday">Martes</option>
                  <option value="Wednesday">Miércoles</option>
                  <option value="Thursday">Jueves</option>
                  <option value="Friday">Viernes</option>
                  <option value="Saturday">Sábado</option>
                  <option value="Sunday">Domingo</option>
                </select>
              </label>
            )}        
      </div>

      {/* Tabla de ingresos */}
      <div className="overflow-x-auto max-w-full">
        <table className="w-full table-auto border border-gray-300 text-sm mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Barbero</th>
              <th className="p-2 border">Servicio</th>
              <th className="p-2 border">Monto</th>
              <th className="p-2 border">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ingresos.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No hay ingresos registrados.
                </td>
              </tr>
            ) : (
              ingresos.map((ingreso) => (
                <tr key={ingreso.id_ingreso} className="text-center">
                  <td className="border p-2">{ingreso.nombre_barbero}</td>
                  <td className="border p-2">{ingreso.nombre_servicio}</td>
                  <td className="border p-2 font-semibold text-green-700">
                    ${Number(ingreso.monto).toFixed(2)}
                  </td>
                  <td className="border p-2">
                    {formatearFecha(ingreso.fecha)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {ingresos.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={2} className="text-right font-bold p-2">
                  Total general:
                </td>
                <td className="text-green-700 font-bold p-2">
                  ${Number(totalGeneral).toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Totales agrupados */}
      {totales.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">Totales por {filtro}</h2>
          <table className="w-full table-auto border border-gray-300 text-sm">
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
                  <td className="border p-2">{t.nombre}</td>
                  <td className="border p-2">
                    {obtenerPeriodoLegible(t.periodo)}
                  </td>
                  <td className="border p-2 font-semibold text-blue-700">
                    ${Number(t.total).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td className="text-right p-2" colSpan={2}>
                  Total general:
                </td>
                <td className="text-blue-700 p-2">
                  ${totalFiltrado.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
