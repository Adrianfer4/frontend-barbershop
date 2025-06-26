"use client";
import { motion } from "framer-motion";
import { FaEnvelope, FaWhatsapp, FaFacebook } from "react-icons/fa";

const ContactSection = () => {
  return (
    <section
      className="bg-black/50 py-12 px-6 md:px-20"
      style={{ fontFamily: "Reey-Regular, cursive" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Texto + Opciones */}
        <div>
          <motion.h2
            id="contacto"
            className="text-3xl md:text-4xl font-bold text-white mb-4 font-[reey]"
            style={{ fontFamily: "Reey-Regular, cursive" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Agenda tu próxima experiencia con nosotros
          </motion.h2>

          <motion.p
            className="text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            En Jamaica Estilo Barbería combinamos arte, precisión y estilo para
            ofrecerte cortes que destacan. ¿Dudas, reservas o sugerencias?
            Contáctanos por el medio que prefieras.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Correo */}
            <motion.div
              className="bg-gray-100 p-4 rounded-xl text-center shadow hover:shadow-md transition"
              whileHover={{ scale: 1.03 }}
            >
              <FaEnvelope className="text-3xl text-amber-600 mb-2 mx-auto" />
              <p className="text-gray-800 font-medium">Escríbenos al correo</p>
              <p className="text-orange-600 font-bold text-sm mt-1">
                jamaica@barber.com
              </p>
              <a
                href="mailto:yerssondereck@gmail.com"
                className="text-sm text-blue-600 underline mt-2 block"
              >
                Enviar mensaje
              </a>
            </motion.div>

            {/* WhatsApp */}
            <motion.div
              className="bg-gray-100 p-4 rounded-xl text-center shadow hover:shadow-md transition"
              whileHover={{ scale: 1.03 }}
            >
              <FaWhatsapp className="text-3xl text-green-600 mb-2 mx-auto" />
              <p className="text-gray-800 font-medium">
                Contáctanos por WhatsApp
              </p>
              <a
                href="https://wa.me/593997186003"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white mt-3 px-4 py-2 rounded inline-block hover:bg-green-700 transition"
              >
                Chatear ahora
              </a>
            </motion.div>

            {/* Facebook */}
            <motion.div
              className="bg-gray-100 p-4 rounded-xl text-center shadow hover:shadow-md transition"
              whileHover={{ scale: 1.03 }}
            >
              <FaFacebook className="text-3xl text-blue-700 mb-2 mx-auto" />
              <p className="text-gray-800 font-medium">Síguenos en Facebook</p>
              <a
                href="https://www.facebook.com/pipe.fernandez.1806?locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 text-white mt-3 px-4 py-2 rounded inline-block hover:bg-blue-800 transition"
              >
                Ir al perfil
              </a>
            </motion.div>
          </div>
        </div>

        {/* Imagen artística barbero */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
        >
          <img
            src="/barber-art-painting.jpg"
            alt="Arte Barbero"
            className="rounded-2xl shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
