"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const Nosotros = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-24 px-6 md:px-20 lg:px-40 bg-gradient-to-br from-zinc-900 via-amber-800 to-yellow-500 text-white text-center"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Texto animado */}
        <div>
          
          <motion.h2
            id="nosotros"
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-[Reey] mb-6 text-white"
            style={{ fontFamily: "Reey-Regular, cursive" }}
          >
            Nosotros
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg md:text-xl leading-relaxed text-white"
          >
            En Jamaica Estilo, cada corte es una obra de arte y cada cliente una
            historia. Nos enorgullecemos de ofrecer una experiencia única,
            combinando el estilo urbano con la calidez caribeña. Nuestro equipo de
            barberos profesionales te acompaña en cada paso para lograr un look
            auténtico, moderno y con actitud.
          </motion.p>
        </div>

        <motion.img
          src="/fachada.jpeg" // reemplaza por tu imagen
          alt="Barbero profesional en acción"
          className="w-[300px] h-[300px] rounded-xl shadow-lg mx-auto"
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
          transition={{ duration: 1 }}
        />
      </div>
    </section>
  );
};

export default Nosotros;
