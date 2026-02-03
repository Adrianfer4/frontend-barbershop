import { useState } from "react";
import ModalAgendar from "../modalesCrud/ModalAgendar";

const BASE_URL = 'https://backend-barbershop-production-2f88.up.railway.app';

type ServicioCardProps = {
  id_servicio: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion?: number;
  imagen?: string;
};

const ServicioCard = ({
  id_servicio,
  nombre,
  descripcion,
  precio,
  duracion,
  imagen,
}: ServicioCardProps) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div className="p-4 bg-amber-100 text-white rounded-2xl shadow-xl border border-amber-600 hover:shadow-2xl transition-all duration-300">
      <div className="relative">
        {imagen ? (
          <img
            src={`${BASE_URL}/uploads/servicios/${imagen}`}
            alt={`Imagen de ${nombre}`}
            className="w-full h-48 object-cover rounded-xl border border-neutral-700"
          />
        ) : (
          <div className="w-full h-48 bg-amber-200 rounded-xl flex items-center justify-center text-gray-400">
            Imagen no disponible
          </div>
        )}
      </div>

      <div className="mt-4 space-y-1 text-center">
        <h3 className="text-xl font-extrabold text-amber-500 tracking-wide uppercase">
          {nombre}
        </h3>
        <p className="text-sm text-sky-500 font-bold italic">{descripcion}</p>

        <div className="flex justify-center items-center gap-4 mt-2">
          <span className="text-sm font-medium bg-amber-600 text-white px-3 py-1 rounded-full shadow-md">
            ${precio}
          </span>
          <span className="text-sm font-medium text-sky-500">
            ⏱ {duracion} min
          </span>
        </div>
      </div>

      <button
        onClick={() => setMostrarModal(true)}
        className="mt-6 w-full bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-bold py-2 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
      >
        Agendar cita
      </button>

      {mostrarModal && (
        <ModalAgendar
          id_servicio={id_servicio}
          setMostrarModal={setMostrarModal}
        />
      )}
    </div>
  );
};

export default ServicioCard;
