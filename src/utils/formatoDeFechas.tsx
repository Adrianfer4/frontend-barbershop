// Función para convertir fecha ISO a formato YYYY-MM-DD (sin tiempo)
export const isoToDateOnly = (isoString: string) => {
  return isoString.split("T")[0];
};

export const obtenerFechaHoy = () => {
  const ahora = new Date();
  const opciones: Intl.DateTimeFormatOptions = {
    timeZone: "America/Guayaquil",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const parts = new Intl.DateTimeFormat("es-EC", opciones).formatToParts(ahora);
  const dia = parts.find((p) => p.type === "day")?.value.padStart(2, "0");
  const mes = parts.find((p) => p.type === "month")?.value.padStart(2, "0");
  const anio = parts.find((p) => p.type === "year")?.value;
  return `${anio}-${mes}-${dia}`;
};
