"use client";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mostrar = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", mostrar);
    return () => window.removeEventListener("scroll", mostrar);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return visible ? (
    <button
      onClick={scrollToTop}
      className="fixed bottom-30 -translate-y-1/3 right-16 z-50 bg-amber-600 text-white p-3 md:p-3.5 rounded-full shadow-lg hover:bg-amber-700 transition text-sm md:text-base"
      aria-label="Volver arriba"
    >
      <FaArrowUp className="w-5 h-5" />
    </button>
  ) : null;
};

export default ScrollButton;
