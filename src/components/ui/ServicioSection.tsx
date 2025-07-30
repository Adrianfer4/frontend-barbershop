import { useEffect, useState } from "react";
import ServicioCard from "./ServicioCard";
import Swal from "sweetalert2";
import LoaderBarbershop from "../../utils/LoaderBarberia";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/servicios")
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          setServicios(data);
          setLoading(false);
        }, 1000);
      })
      
      .catch((err) => {
        console.error(err);
        setLoading(false);
        Swal.fire("Error", "No se pudo cargar los servicios", "error");
      });
  }, []);

  if (loading) return <LoaderBarbershop mensaje="Cargando servicios..." />

  return (
    <section className="p-6">
      <h2
        id="servicios"
        className="text-4xl text-white font-bold text-center mb-6 font-[Reey]"
        style={{ fontFamily: "Reey-Regular, cursive" }}
      >
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
