import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import GraficosIngresos from "../graficosIngresos/GraficosIngresos";
import "../../styles/exportarPDF.css";

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

  useEffect(() => {
    if (
      (filtro === "mes" && selectedMonth) ||
      (filtro === "año" && selectedYear) ||
      (filtro === "dia" && selectedDay)
    ) {
      cargarTotalesAgrupados(filtro, selectedYear, selectedMonth, selectedDay);
    }
  }, [selectedDay, selectedMonth, selectedYear, filtro]);

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
        headers: { Authorization: `Bearer ${token}` },
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
        { headers: { Authorization: `Bearer ${token}` } }
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

  const totalGeneral = ingresos.reduce((acc, i) => acc + Number(i.monto), 0);

  const exportarPDFConGrafico = async () => {
    const input = document.getElementById("reporte-pdf");
    if (!input) {
      return Swal.fire(
        "Error",
        "No se encontró el contenido para exportar",
        "error"
      );
    }

    // Agregamos clase que muestra el logo
    input.classList.add("mostrar-logo-pdf");

    const canvas = await html2canvas(input, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    // Removemos la clase después de capturar
    input.classList.remove("mostrar-logo-pdf");

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save("reporte-ingresos.pdf");
  };

  return (
    <div className="ingresos-container">
      <div className="export-button-container">
        <h1 className="ingresos-header">Ingresos</h1>
        <button onClick={exportarPDFConGrafico} className="pdf-button">
          Exportar PDF
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-container">
        <label className="filter-label">
          Desde:
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="filter-input"
          />
        </label>
        <label className="filter-label">
          Hasta:
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="filter-input"
          />
        </label>
        <label className="filter-label">
          Barbero:
          <select
            value={barberoSeleccionado}
            onChange={(e) => setBarberoSeleccionado(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos</option>
            {barberos.map((b) => (
              <option key={b.id_usuario} value={b.id_usuario}>
                {b.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-label">
          Agrupar por:
          <select
            value={filtro}
            onChange={(e) => {
              const nuevo = e.target.value as "dia" | "semana" | "mes" | "año";
              setFiltro(nuevo);
              cargarTotalesAgrupados(
                nuevo,
                selectedYear,
                selectedMonth,
                selectedDay
              );
            }}
            className="filter-select"
          >
            <option value="dia">Día</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
            <option value="año">Año</option>
          </select>
        </label>

        {filtro === "año" && (
          <label className="filter-label">
            Año:
            <select
              value={selectedYear}
              onChange={(e) => {
                const año = e.target.value;
                setSelectedYear(año);
                cargarTotalesAgrupados(filtro, año, selectedMonth);
              }}
              className="filter-select"
            >
              <option value="">Todos</option>
              {[2025, 2026, 2027].map((año) => (
                <option key={año} value={año}>
                  {año}
                </option>
              ))}
            </select>
          </label>
        )}
        {filtro === "mes" && (
          <label className="filter-label">
            Mes:
            <select
              value={selectedMonth}
              onChange={(e) => {
                const mes = e.target.value;
                setSelectedMonth(mes);
                cargarTotalesAgrupados(filtro, selectedYear, mes);
              }}
              className="filter-select"
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
          <label className="filter-label">
            Día:
            <select
              value={selectedDay}
              onChange={(e) => {
                const dia = e.target.value;
                setSelectedDay(dia);
                cargarTotalesAgrupados(
                  filtro,
                  selectedYear,
                  selectedMonth,
                  dia
                );
              }}
              className="filter-select"
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

      {/* Contenido exportable */}
      <div id="reporte-pdf" className="reporte-pdf">
        <div className="logo-header-wrapper logo-pdf-only">
          <img src="/logoBarbershop.png" alt="Logo" className="logo-img" />
          <h1 className="ingresos-header">Ingresos</h1>
        </div>

        <div className="exportable-content">
          <table className="pdf-table">
            <thead>
              <tr>
                <th>Barbero</th>
                <th>Servicio</th>
                <th>Monto</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ingresos.length === 0 ? (
                <tr>
                  <td colSpan={4}>No hay ingresos registrados.</td>
                </tr>
              ) : (
                ingresos.map((i) => (
                  <tr key={i.id_ingreso}>
                    <td>{i.nombre_barbero}</td>
                    <td>{i.nombre_servicio}</td>
                    <td>${Number(i.monto).toFixed(2)}</td>
                    <td>{formatearFecha(i.fecha)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {ingresos.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={2}>Total general:</td>
                  <td>${totalGeneral.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {totales.length > 0 && (
          <>
            <h2 className="titulo">Totales por {filtro}</h2>
            <GraficosIngresos totales={totales} filtro={filtro} />
          </>
        )}
      </div>
    </div>
  );
}
