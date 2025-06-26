import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
  vistaActual: string;
  onSeleccionarVista: (vista: string) => void;
}

export default function AdminLayout({ children, vistaActual, onSeleccionarVista }: AdminLayoutProps) {
  const [sidebarAbierto, setSidebarAbierto] = useState(false); // 👈 estado nuevo

  return (
    <div className="flex min-h-screen bg-[#f3e8e0]">
      {/* Sidebar con visibilidad controlada */}
      <Sidebar
        vistaActual={vistaActual}
        onSeleccionarVista={(vista) => {
          onSeleccionarVista(vista);
          setSidebarAbierto(false); // cerrar al seleccionar en móvil
        }}
        visible={sidebarAbierto}
        onClose={() => setSidebarAbierto(false)}
      />

      {/* Contenido principal */}
      <main className="flex-1 p-6 overflow-y-auto ">
        {/* Botón hamburguesa visible solo en móvil */}
        <button
          className="md:hidden text-2xl mb-4"
          onClick={() => setSidebarAbierto(true)}
        >
          ☰
        </button>

        {children}
      </main>
    </div>
  );
}
