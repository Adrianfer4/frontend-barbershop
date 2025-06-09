import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Asegúrate de tener lucide-react instalado
import Swal from "sweetalert2";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState<string>("");
  const [confirmar, setConfirmar] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [mostrarPass, setMostrarPass] = useState<boolean>(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (mensaje) {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [mensaje, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (password !== confirmar) {
      setError("Las contraseñas no coinciden");
      Swal.fire({
        icon: "warning",
        title: "Contraseñas no coinciden",
        text: "Por favor, verifica que ambas contraseñas sean iguales.",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Error al actualizar contraseña");

      setMensaje(data.mensaje);

      Swal.fire({
        icon: "success",
        title: "Contraseña actualizada",
        text:
          data.mensaje || "Tu contraseña ha sido restablecida correctamente.",
      });

      setPassword("");
      setConfirmar("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[url('/brick-wall.jpg')] bg-cover bg-center flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-xl shadow-2xl bg-white/80 backdrop-blur">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Restablecer Contraseña
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={mostrarPass ? "text" : "password"}
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-3 pt-6 pb-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-2 text-gray-700 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Nueva contraseña
            </label>
            <button
              type="button"
              onClick={() => setMostrarPass((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {mostrarPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={mostrarConfirmar ? "text" : "password"}
              id="confirmar"
              required
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="peer w-full px-3 pt-6 pb-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="confirmar"
              className="absolute left-3 top-2 text-gray-700 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Confirmar contraseña
            </label>
            <button
              type="button"
              onClick={() => setMostrarConfirmar((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {mostrarConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Cambiar contraseña
          </button>
        </form>

        {mensaje && (
          <p className="text-green-600 mt-4 text-center">{mensaje}</p>
        )}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
