import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import GraficosIngresos from "../graficosIngresos/GraficosIngresos";
import IngresoModal from "../modalesCrud/IngresoModal";

type Ingreso = {
  id_ingreso: number;
  id_barbero: number;
  nombre_barbero: string;
  id_servicio: number;
  nombre_servicio: string;
  monto: number;
  fecha: string;
  descripcion?: string;
};

type IngresoAgrupado = {
  id_barbero: number;
  nombre: string;
  total: number;
  periodo: string | number;
};

type IngresoModalData = {
  id_cita: null;
  id_ingreso: number;
  id_barbero: number;
  id_servicio: number;
  monto: number;
};

export default function Ingresos() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [barberos, setBarberos] = useState<
    { id_usuario: number; nombre: string }[]
  >([]);
  const [servicios, setServicios] = useState<
    { id_servicio: number; nombre_servicio: string; precio: number }[]
  >([]);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState("");
  const [totales, setTotales] = useState<IngresoAgrupado[]>([]);
  const [filtro, setFiltro] = useState<"dia" | "semana" | "mes" | "año">("dia");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [modalIngreso, setModalIngreso] = useState<{
    show: boolean;
    ingreso?: IngresoModalData;
  }>({ show: false });

  {
    /*Paginacion */
  }
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const currentIngresos = ingresos.slice(indiceInicio, indiceFin);

  const totalPaginas = Math.ceil(ingresos.length / elementosPorPagina);

  const abrirCrear = () => setModalIngreso({ show: true });
  const abrirEditar = (i: Ingreso) =>
    setModalIngreso({
      show: true,
      ingreso: {
        id_ingreso: i.id_ingreso,
        id_barbero: i.id_barbero,
        id_servicio: i.id_servicio,
        monto: i.monto,
        id_cita: null,
      },
    });
  const cerrarModal = () => setModalIngreso({ show: false });

  useEffect(() => {
    fetchBarberos();
    fetchServicios();
    cargarTotalesAgrupados(filtro);
  }, [filtro]); 

  useEffect(() => {
    cargarTotalesAgrupados(filtro, selectedYear, selectedMonth, selectedDay);
  }, [selectedDay, selectedMonth, selectedYear, filtro]);

  const fetchBarberos = async () => {
    const res = await fetch("http://localhost:3000/api/usuarios/barberos");
    const data = await res.json();
    setBarberos(data);
  };

  const fetchServicios = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/servicios", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setServicios(data);
  };

  const fetchIngresos = useCallback(async () => {
    const params = new URLSearchParams();
    if (desde) params.append("desde", desde);
    if (hasta) params.append("hasta", hasta);
    if (barberoSeleccionado) params.append("id_barbero", barberoSeleccionado);

    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/api/ingresos?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: Ingreso[] = await res.json();
    setIngresos(data);
    setPaginaActual(1);
  }, [desde, hasta, barberoSeleccionado]);

  useEffect(() => {
  if (desde && hasta && new Date(hasta) < new Date(desde)) {
    Swal.fire("Error", "'Hasta' no puede ser antes que 'Desde'", "error");
    return;
  }
  fetchIngresos(); 
}, [desde, hasta, barberoSeleccionado, fetchIngresos]);

  const cargarTotalesAgrupados = async (
    f: "dia" | "semana" | "mes" | "año",
    año?: string,
    mes?: string,
    dia?: string
  ) => {
    const params = new URLSearchParams({ filtro: f });
    if (año) params.append("año", año);
    if (mes) params.append("mes", mes);
    if (dia) params.append("dia", dia);

    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:3000/api/ingresos/agrupado?${params}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data: IngresoAgrupado[] = await res.json();
    setTotales(data);
  };

  const eliminarIngreso = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar ingreso?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
    });
    if (!confirm.isConfirmed) return;

    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3000/api/ingresos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchIngresos();
    Swal.fire("Eliminado", "Ingreso eliminado correctamente", "success");
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return "Fecha inválida";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const totalGeneral = ingresos.reduce((acc, i) => acc + Number(i.monto), 0);

  return (
    <div className="p-4 bg-gray-100 shadow rounded-xl">
      <div className="flex justify-center items-center mb-6">
        <h1
          className="text-3xl uppercase text-amber-600 text-center font-semi-bold "
          style={{ fontFamily: "'Russo One', sans-serif" }}
        >
          Gestión de Ingresos
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 items-center">
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
      </div>

      <div className="overflow-x-auto max-w-full bg-white">
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Barbero</th>
              <th className="p-2 border">Servicio</th>
              <th className="p-2 border">Monto</th>
              <th className="p-2 border">Descripción</th>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentIngresos.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No hay ingresos registrados.
                </td>
              </tr>
            ) : (
              currentIngresos.map((i) => (
                <tr key={i.id_ingreso} className="text-center">
                  <td className="border p-2">{i.nombre_barbero}</td>
                  <td className="border p-2">{i.nombre_servicio}</td>
                  <td className="border p-2">${Number(i.monto).toFixed(2)}</td>
                  <td className="border p-2">{i.descripcion || "—"}</td>
                  <td className="border p-2">{formatearFecha(i.fecha)}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => abrirEditar(i)}
                      className="text-blue-600 hover:underline transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarIngreso(i.id_ingreso)}
                      className="text-red-600 hover:underline transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {ingresos.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={2} className="font-bold text-right p-2">
                  Total General:
                </td>
                <td className="font-bold p-2">${totalGeneral.toFixed(2)}</td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Paginacion */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 transition"
        >
          Anterior
        </button>

        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            onClick={() => setPaginaActual(i + 1)}
            className={`px-3 py-1 rounded ${
              paginaActual === i + 1
                ? "bg-amber-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 transition"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
          }
          disabled={paginaActual === totalPaginas}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 transition"
        >
          Siguiente
        </button>
      </div>

      <div className="text-left">
          <button
            onClick={abrirCrear}
            className="fixed bottom-8 right-6 bg-amber-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-amber-700 z-50 transition"
          >
            + Crear Ingreso
          </button>
        </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Totales por {filtro}</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          <select
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value as typeof filtro);
              setSelectedYear("");
              setSelectedMonth("");
              setSelectedDay("");
            }}
            className="border p-2 rounded"
          >
            <option value="dia">Día</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
            <option value="año">Año</option>
          </select>

          {filtro === "año" && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Todos</option>
              {[2025, 2026, 2027].map((año) => (
                <option key={año} value={año}>
                  {año}
                </option>
              ))}
            </select>
          )}

          {filtro === "mes" && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border p-2 rounded"
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
          )}

          {filtro === "dia" && (
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="border p-2 rounded"
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
          )}
        </div>

        {totales.length > 0 ? (
          <GraficosIngresos totales={totales} filtro={filtro} />
        ) : (
          <p className="text-center text-gray-500">
            No hay datos para mostrar con los filtros seleccionados.
          </p>
        )}
      </div>

      <IngresoModal
        show={modalIngreso.show}
        ingreso={modalIngreso.ingreso}
        barberos={barberos}
        servicios={servicios}
        onClose={cerrarModal}
        onSaved={fetchIngresos}
      />
    </div>
  );
}
