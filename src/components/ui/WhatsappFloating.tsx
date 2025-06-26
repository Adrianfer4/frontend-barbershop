import { FaWhatsapp } from "react-icons/fa";

const WhatsAppFloating = () => {
  return (
    <a
      href="https://wa.me/+593997186003?text=Hola%2C%20quisiera%20agendar%20una%20cita"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-12 right-12 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300"
      title="Contáctanos por WhatsApp"
    >
      <FaWhatsapp className="text-5xl" />
    </a>
  );
};

export default WhatsAppFloating;
