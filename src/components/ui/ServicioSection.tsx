import { useEffect, useState } from "react";
import ServicioCard from "./ServicioCard";

type Servicio = {
  id_servicio: number;
  nombre_servicio: string;
  descripcion: string;
  precio: number;
  duracion?: number;
  imagen?: string;
};

const ServicioSection = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/servicios")
      .then((res) => res.json())
      .then(setServicios)
      .catch(console.error);
  }, []);

  return (
    <section className="p-6">
      <h2 id="servicios" className="text-2xl text-amber-800 font-semibold text-center mb-6">
        Nuestros Servicios
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {servicios.map((s) => (
          <ServicioCard
            key={s.id_servicio}
            id_servicio={s.id_servicio}
            nombre={s.nombre_servicio}
            descripcion={s.descripcion}
            precio={s.precio}
            duracion={s.duracion}
            imagen={s.imagen ? s.imagen : undefined}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicioSection;
