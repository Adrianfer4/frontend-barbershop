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
  const links = [
    { id: "dashboard", label: "Dashboard" },
    { id: "clientes", label: "Clientes" },
    { id: "servicios", label: "Servicios" },
    { id: "citas", label: "Citas" },
  ];

  return (
    <>
      {/* Fondo oscuro para móvil */}
      {visible && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-50 md:static transform transition-transform duration-300 ${
          visible ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 min-h-screen shadow-lg border-r text-white bg-black overflow-hidden`}
      >
        <img
          src="/sidebar.jpg"
          alt="Fondo"
          className="absolute inset-0 h-full w-full z-0"
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            {/* Botón de cerrar solo en móvil */}
            <button onClick={onClose} className="md:hidden text-white text-xl">
              ✖
            </button>
          </div>

          <nav className="flex flex-col space-y-2">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => onSeleccionarVista(link.id)}
                className={`text-left p-2 rounded w-full ${
                  vistaActual === link.id
                    ? "bg-blue-600 text-white"
                    : "hover:bg-white/10"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
