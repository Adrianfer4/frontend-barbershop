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
      className="relative py-24 px-6 md:px-20 lg:px-40 bg-black/50 backdrop-blur-sm text-white"
    >
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl text-center font-[Reey] text-white mb-6"
        style={{ fontFamily: "Reey-Regular, cursive" }}
      >
        Nosotros
      </motion.h2>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-lg md:text-xl text-center leading-relaxed text-white"
      >
        En Jamaica Estilo, cada corte es una obra de arte y cada cliente una historia.
        Nos enorgullecemos de ofrecer una experiencia única, combinando el estilo urbano
        con la calidez caribeña. Nuestro equipo de barberos profesionales te acompaña
        en cada paso para lograr un look auténtico, moderno y con actitud.
      </motion.p>
    </section>
  );
};

export default Nosotros;
