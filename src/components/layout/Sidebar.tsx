import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBill,
  FaUser,
  FaHome,
  FaSignOutAlt,
  FaRegHandScissors,
} from "react-icons/fa";

interface SidebarProps {
  vistaActual: string;
  onSeleccionarVista: (vista: string) => void;
  visible: boolean;
  onClose: () => void;
}

export function Sidebar({
  vistaActual,
  onSeleccionarVista,
  visible,
  onClose,
}: SidebarProps) {
  const navigate = useNavigate();

  const mainLinks = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { id: "clientes", label: "Clientes", icon: <FaUsers /> },
    { id: "servicios", label: "Servicios", icon: <FaRegHandScissors /> },
    { id: "citas", label: "Citas", icon: <FaCalendarAlt /> },
    { id: "ingresos", label: "Ingresos", icon: <FaMoneyBill /> },
  ];

  return (
    <>
      {visible && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-50 md:fixed top-0 transform transition-transform duration-300 ${
          visible ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 h-screen shadow-lg border-r text-white bg-black overflow-hidden`}
      >
        <div className="absolute inset-0 bg-yellow-700 z-10" />
        <div className="relative z-20 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <button onClick={onClose} className="md:hidden text-white text-xl transition">
              ✖
            </button>
          </div>

          {/* Enlaces principales */}
          <nav className="flex flex-col space-y-2">
            {mainLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onSeleccionarVista(link.id);
                  onClose();
                }}
                className={`flex items-center gap-2 text-left p-2 rounded w-full ${
                  vistaActual === link.id
                    ? "bg-amber-600 text-white"
                    : "hover:bg-white/10 transition"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {/* Separador */}
          <hr className="my-4 border-white/30" />

          {/* Enlaces adicionales */}
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => {
                navigate("/perfil");
                onClose();
              }}
              className="flex items-center gap-2 text-left p-2 rounded w-full hover:bg-white/10 transition"
            >
              <FaUser className="text-lg" />
              <span>Perfil</span>
            </button>

            <button
              onClick={() => {
                navigate("/");
                onClose();
              }}
              className="flex items-center gap-2 text-left p-2 rounded w-full hover:bg-white/10 transition"
            >
              <FaHome className="text-lg" />
              <span>Inicio</span>
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="flex items-center gap-2 text-left p-2 rounded w-full hover:bg-white/10 text-red-200 transition"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Cerrar sesión</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}
