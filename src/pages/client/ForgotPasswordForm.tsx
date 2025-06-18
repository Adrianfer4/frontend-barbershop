import { useState } from "react";
import Swal from "sweetalert2";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar el correo");

      setMensaje(data.mensaje);

      Swal.fire({
        icon: "success",
        title: "Correo enviado",
        text: data.mensaje || "Revisa tu correo para restablecer la contraseña",
      });
    } catch (err: unknown) {
      let message = "Error desconocido";
      if (err instanceof Error) message = err.message;

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
          Recuperar Contraseña
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`peer w-full px-3 pt-6 pb-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-2 text-gray-900 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Correo electrónico
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Enviar enlace de recuperación
          </button>
        </form>
        {mensaje && <p className="text-green-600 mt-4">{mensaje}</p>}
        {mensaje && (
          <p className="text-green-600 mt-4 text-center">{mensaje}</p>
        )}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
