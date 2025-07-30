import GraficosDashboard from "../graficosDashboard/GraficosDashboard";
import TarjetasDashboard from "../graficosDashboard/TarjetaDashboard";

export default function UltimasCitasDashboard() {
  return (
    <div className="p-4 space-y-4">
      <h1
        className="text-3xl uppercase text-amber-600 text-center font-semi-bold mb-6"
        style={{ fontFamily: "'Russo One', sans-serif" }}
      >
        Dahsboard
      </h1>
      <TarjetasDashboard />
      <GraficosDashboard />
    </div>
  );
}
