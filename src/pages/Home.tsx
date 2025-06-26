import Navbar from "../components/ui/Navbar";
import HeroAnimado from "../components/ui/Hero";
import Nosotros from "../components/ui/Nosotros";
import ServicioSection from "../components/ui/ServicioSection";
import Footer from "../components/ui/Footer";
import ContactSection from "../components/ui/Contacto";
import WhatsAppFloating from "../components/ui/WhatsappFloating";

const Home = () => {
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
    </main>
  );
};

export default Home;
