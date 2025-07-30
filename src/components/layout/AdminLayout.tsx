import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
  vistaActual: string;
  onSeleccionarVista: (vista: string) => void;
}

export default function AdminLayout({ children, vistaActual, onSeleccionarVista }: AdminLayoutProps) {
  const [sidebarAbierto, setSidebarAbierto] = useState(false); // 

  return (
    <div className="flex min-h-screen bg-amber-200/50">
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
      <main className="flex-1 p-6 overflow-y-auto p-6 md:ml-64">
        {/* Botón hamburguesa visible solo en móvil */}
        <button
          className="md:hidden text-2xl mb-4 transition"
          onClick={() => setSidebarAbierto(true)}
        >
          ☰
        </button>

        {children}
      </main>
    </div>
  );
}
