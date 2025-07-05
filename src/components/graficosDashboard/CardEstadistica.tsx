import type { ReactNode } from "react";

interface CardProps {
  titulo: string;
  valor: number | string;
  icono: ReactNode;
  color: string;
}

export default function CardEstadistica({
  titulo,
  valor,
  icono,
  color,
}: CardProps) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl p-4 text-white shadow-lg ${color} min-h-[120px]`}
    >
      {/* Ícono superior derecho */}
      <div className="absolute top-3 left-3 text-4xl opacity-30 pointer-events-none">
        {icono}
      </div>

      {/* Contenido */}
      <div className="flex flex-col z-10">
        <p className="absolute text-sm uppercase font-semibold tracking-wider left-18 ">
          {titulo}
        </p>
        <div className="flex flex-col items-center mt-6">
          <h3 className="text-3xl font-bold mt-4">{valor}</h3>
          <p className="text-xs mt-1 text-white/80">
            Total {titulo.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
