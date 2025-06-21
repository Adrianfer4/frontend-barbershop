const servicios = [
  { nombre: "Corte clásico", tiempo: "30 min" },
  { nombre: "Corte + Barba", tiempo: "45 min" },
  { nombre: "Diseño personalizado", tiempo: "40 min" },
];

const ServiciosDestacados = () => {
  return (
    <section className="py-10 px-4">
      <h3 className="text-2xl font-semibold mb-6 text-center">Servicios destacados</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {servicios.map((s, i) => (
          <div key={i} className="border rounded-xl p-4 shadow hover:shadow-lg transition">
            <h4 className="font-bold text-amber-700">{s.nombre}</h4>
            <p className="text-sm mt-2">Duración: {s.tiempo}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiciosDestacados;
