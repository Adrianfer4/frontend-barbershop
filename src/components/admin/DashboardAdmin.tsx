import GraficosDashboard from "../graficosDashboard/GraficosDashboard";
import TarjetasDashboard from "../graficosDashboard/TarjetaDashboard";

export default function UltimasCitasDashboard() {
  return (
    <div className="p-4 space-y-4">
      <TarjetasDashboard />
      <GraficosDashboard />
    </div>
  );
}
