"use client";
import { useEffect, useState } from "react";
import { Menu, X, User } from "lucide-react";

type Usuario = {
  id_usuario: number;
  foto_perfil?: string;
};

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_BASE = `${BASE_URL}/api`;

const Navbar = () => {
  const [logueado, setLogueado] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLogueado(true);
    const payload = JSON.parse(atob(token.split(".")[1]));
    const id = payload.id;

    fetch(`${API_BASE}/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) =>
        setUsuario({
          id_usuario: data.id_usuario,
          foto_perfil: data.foto_perfil,
        }),
      )
      .catch(() => setUsuario(null));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogueado(false);
    window.location.href = "/";
  };

  const NavLink = ({ href, texto }: { href: string; texto: string }) => (
    <a
      href={href}
      onClick={() => setMenuAbierto(false)}
      className="text-white font-medium hover:text-black transition-colors duration-300 relative group font-[Reey] text-lg"
      style={{ fontFamily: "Reey-Regular, cursive" }}
    >
      {texto}
      <span className="block h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 mt-1" />
    </a>
  );

  const PerfilIcon = () => (
    <a
      href="/perfil"
      title="Mi perfil"
      className="block w-12 h-12 rounded-full overflow-hidden border border-white"
    >
      {usuario?.foto_perfil ? (
        <img
          src={`${BASE_URL}/uploads/usuarios/${usuario.foto_perfil}`}
          alt="Perfil"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-white flex items-center justify-center">
          <User className="text-amber-600 w-5 h-5 text-amber-500" />
        </div>
      )}
    </a>
  );

  return (
    <nav className="sticky top-0 z-50 bg-amber-500/80 backdrop-blur-md shadow-md border-b border-amber-700/40">
      <div className="flex justify-between items-center px-6 py-3 lg:px-12">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logoBarbershop.png"
            alt="Logo"
            className="h-18 md:h-18 object-contain"
          />
        </div>

        {/* Hamburguesa (móviles) */}
        <div className="lg:hidden">
          <button onClick={() => setMenuAbierto(!menuAbierto)}>
            {menuAbierto ? (
              <X size={28} className="text-white" />
            ) : (
              <Menu size={28} className="text-white" />
            )}
          </button>
        </div>

        {/* Menú para pantallas grandes */}
        <div className="hidden lg:flex justify-center items-center gap-8 text-amber-200">
          <NavLink href="/" texto="Inicio" />
          <NavLink href="#nosotros" texto="Nosotros" />
          <NavLink href="#servicios" texto="Servicios" />
          <NavLink href="#contacto" texto="Contacto" />
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {logueado ? (
            <button
              onClick={handleLogout}
              className="text-white text-bold text-lg hover:text-red-900 transition"
            >
              Salir
            </button>
          ) : (
            <NavLink href="/login" texto="Ingresar" />
          )}
          {logueado && <PerfilIcon />}
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {menuAbierto && (
        <div className="lg:hidden absolute right-5 top-12 z-40  rounded-lg px-14 py-3 text-sm text-white shadow-lg flex flex-col gap-3">
          {logueado && <PerfilIcon />}
          <NavLink href="/" texto="Inicio" />
          <NavLink href="#nosotros" texto="Nosotros" />
          <NavLink href="#servicios" texto="Servicios" />
          <NavLink href="#contacto" texto="Contacto" />
          {logueado ? (
            <button
              onClick={handleLogout}
              className="text-white font-bold text-lg hover:text-red-700 transition text-left"
              style={{ fontFamily: "Reey-Regular, cursive" }}
            >
              Salir
            </button>
          ) : (
            <NavLink href="/login" texto="Ingresar" />
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
