const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-white sticky top-0 z-50">
      <h1 className="text-xl font-bold text-amber-700">Jamaica Estilo</h1>
      <div className="space-x-4">
        <a href="/" className="hover:text-amber-700">Inicio</a>
        <a href="#servicios" className="hover:text-amber-700">Servicios</a>
        <a href="/login" className="hover:text-amber-700">Ingresar</a>
      </div>
    </nav>
  );
};

export default Navbar;
