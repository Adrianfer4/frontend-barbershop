import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[url('/fondo.jpg')] bg-cover bg-center bg-no-repeat">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
