import { useState, useEffect } from "react";
import Navbar from "../components/ui/Navbar";
import HeroAnimado from "../components/ui/Hero";
import Nosotros from "../components/ui/Nosotros";
import ServicioSection from "../components/ui/ServicioSection";
import Footer from "../components/ui/Footer";
import ContactSection from "../components/ui/Contacto";
import WhatsAppFloating from "../components/ui/WhatsappFloating";
import ScrollButton from "../components/ui/ScrollButton";
import LoaderBarbershop from "../utils/LoaderBarberia";

const Home = () => {
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoaderBarbershop mensaje="Bienvenido a Jamaica Estilo" />

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center blur fixed"
        style={{ backgroundImage: "url('/fachada.jpeg')" }}
      />
      <Navbar />
      <HeroAnimado />
      <Nosotros />
      <ServicioSection />
      <ContactSection />
      <Footer />
      <WhatsAppFloating />
      <ScrollButton />
    </main>
  );
};

export default Home;
