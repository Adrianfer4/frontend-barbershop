import { motion } from "framer-motion";

const HeroAnimado = () => {
  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-white px-6 text-center overflow-hidden">

      {/* Video de fondo animado */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-50"
      >
        <source src="/videos/barbershop-style.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      {/* Contenido animado */}
      <div className="relative z-20">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg font-[Reey]"
          style={{ fontFamily: "Reey-Regular, cursive" }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          Bienvenido a Jamaica Estilo
        </motion.h1>

        <motion.p
          className="mt-4 text-lg md:text-2xl text-white max-w-xl drop-shadow"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Vive la experiencia premium de barbería con estilo urbano y detalles únicos.
        </motion.p>

        <motion.a
          href="#servicios"
          className="mt-10 inline-block bg-white text-amber-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-amber-200 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Reservar ahora
        </motion.a>
      </div>
    </section>
  );
};

export default HeroAnimado;
