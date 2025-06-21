import Navbar from "../components/ui/Navbar";
import Hero from "../components/ui/Hero";
import ServiciosDestacados from "../components/ui/ServiciosDestacados";
import ServicioSection from "../components/ui/ServicioSection";
import Footer from "../components/ui/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <ServiciosDestacados />
      <ServicioSection />
      <Footer />
    </>
  );
};

export default Home;
