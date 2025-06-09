import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();

  const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/dashboard/clientes", label: "Clientes" },
    { to: "/dashboard/servicios", label: "Servicios" },
  ];

  return (
    <aside className="w-64 min-h-screen relative shadow-lg border-r text-white overflow-hidden">
      <img
        src="/sidebar.jpg"
        alt="Fondo"
        className="absolute inset-0  h-full z-1"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-20 p-6 space-y-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <nav className="flex flex-col space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`p-2 rounded ${
                location.pathname === link.to
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
