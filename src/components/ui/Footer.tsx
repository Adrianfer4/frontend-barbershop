import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaFacebookF,
  FaWhatsapp,
  FaHome,
  FaCut,
  FaUsers,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-yellow-500 via-amber-800 to-zinc-900 text-white py-10 px-6"
    style={{ fontFamily: "Reey-Regular, cursive" }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 text-center md:text-left">
        {/* Sección 1: Acerca de */}
        <div className="px-20 space-y-3">
          <h4 className="text-xl font-semibold">Jamaica Estilo</h4>
          <p className="text-sm text-white/80">
            Somos una barbería con esencia caribeña, pasión por el estilo y compromiso con tu imagen. 
            Visítanos y vive la experiencia <strong>Jamaica Estilo</strong>.
          </p>
          <div className="flex gap-4 justify-center md:justify-start mt-2">
            <a href="https://www.facebook.com/pipe.fernandez.1806?locale=es_LA" target="_blank" rel="noreferrer">
              <FaFacebookF className="text-white hover:text-blue-200 text-xl" />
            </a>
            <a href="https://wa.me/593997186003" target="_blank" rel="noreferrer">
              <FaWhatsapp className="text-white hover:text-green-300 text-xl" />
            </a>
          </div>
        </div>

        {/* Sección 2: Informacion */}
        <div className="md:w-1/3 space-y-2">
          <h4 className="text-xl font-semibold mb-3">Información</h4>
          <p className="flex items-center gap-2 justify-center md:justify-start text-white/80 text-sm">
            <FaMapMarkerAlt /> Av. Principal, Local 12, Ecuador
          </p>
          <p className="flex items-center gap-2 justify-center md:justify-start text-white/80 text-sm">
            <FaPhoneAlt /> +593 997 186 003
          </p>
          <p className="flex items-center gap-2 justify-center md:justify-start text-white/80 text-sm">
            <FaEnvelope /> jamaica@barber.com
          </p>
          <p className="flex items-center gap-2 justify-center md:justify-start text-white/80 text-sm">
            <FaClock /> Lunes a Domingo: 09:00 - 18:00
          </p>
        </div>

        {/* Sección 3: Enlaces rápidos */}
        <div className="md:w-1/3 space-y-2">
          <h4 className="text-xl font-semibold mb-3">Enlaces</h4>
          <p className="flex items-center gap-2 justify-center md:justify-start text-white/80 text-sm">
            <FaHome /> <a href="/" className="hover:text-white">Inicio</a>
          </p>
          <p className="flex items-center gap-2 justify-center md:justify-start text-white/80 text-sm">
            <FaCut /> <a href="#servicios" className="hover:text-white">Servicios</a>
          </p>
          <p className="flex items-center gap-2 justify-center md:justify-start text-white/80 text-sm">
            <FaUsers /> <a href="#nosotros" className="hover:text-white">Nosotros</a>
          </p>
          <p className="flex items-center gap-2 justify-center md:justify-start text-white/80 text-sm">
            <FaEnvelope /> <a href="#contacto" className="hover:text-white">Contacto</a>
          </p>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-white/30 mt-8 pt-4 text-sm text-white/70 text-center">
        &copy; {new Date().getFullYear()} Jamaica Estilo. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
