import AdminLayout from "../../components/layout/AdminLayout";

export default function Dashboard() {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4 text-white ">Bienvenido al panel</h2>
      <p>Desde aquí puedes administrar los clientes y servicios.</p>
    </AdminLayout>
  );
}
