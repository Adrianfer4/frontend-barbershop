import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";

const API_BASE = 'https://backend-barbershop-production-2f88.up.railway.app/api';

export default function RegisterForm() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mostrarPass, setMostrarPass] = useState<boolean>(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    nombre?: string;
    apellido?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El correo no es válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Mínimo 8 caracteres, incluye letras, números y símbolos";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Debe confirmar la contraseña";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, apellido, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ email: errorData.message || "Error al registrarse" });

        Swal.fire({
          icon: "error",
          title: "Registro fallido",
          text: errorData.message || "No se pudo registrar el usuario.",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Revisa tu correo electrónico para verificar la cuenta.",
        confirmButtonText: "Entendido",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Error al registrar:", error);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor. Intenta más tarde.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white px-8 py-4 rounded-2xl shadow-xl w-[350px] h-[500px]"
    >
      <h2 className="text-2xl font-bold mb-2 text-center">Registrarse</h2>

      <div className="relative mb-2">
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={`peer h-12 w-full border rounded-lg px-3 pt-4 text-sm placeholder-transparent focus:outline-none focus:ring-2 ${
            errors.nombre
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-400"
          }`}
          placeholder="Nombre"
        />
        <label
          htmlFor="nombre"
          className="absolute left-2 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
        >
          Nombre
        </label>
        {errors.nombre && (
          <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
        )}
      </div>

      <div className="relative mb-2">
        <input
          type="text"
          id="apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          className={
            "peer h-12 w-full border rounded-lg px-3 pt-4 text-sm placeholder-transparent focus:outline-none focus:ring-2 border-gray-300"
          }
          placeholder="Apellido"
        />
        <label
          htmlFor="apellido"
          className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
        >
          Apellido
        </label>
      </div>

      <div className="relative mb-2">
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`peer h-12 w-full border rounded-lg px-3 pt-4 text-sm placeholder-transparent focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-400"
          }`}
          placeholder="E-mail"
        />
        <label
          htmlFor="email"
          className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
        >
          Correo electronico
        </label>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div className="relative mb-2">
        <input
          type={mostrarPass ? "text" : "password"}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`peer h-12 w-full border rounded-lg px-3 pt-4 text-sm placeholder-transparent focus:outline-none focus:ring-2 ${
            errors.password
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-400"
          }`}
          placeholder="Contraseña"
        />
        <button
          type="button"
          onClick={() => setMostrarPass((prev) => !prev)}
          className="absolute right-2 top-1/3 -translate-y-1/3 text-gray-500 transition"
          tabIndex={-1}
        >
          {mostrarPass ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        <label
          htmlFor="password"
          className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
        >
          Contraseña
        </label>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>

      <div className="relative mb-4">
        <input
          type={mostrarConfirmar ? "text" : "password"}
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`peer h-12 w-full border rounded-lg px-3 pt-4 text-sm placeholder-transparent focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-400"
          }`}
          placeholder="Repite tu contraseña"
        />
        <button
          type="button"
          onClick={() => setMostrarConfirmar((prev) => !prev)}
          className="absolute right-2 top-1/3 -translate-y-1/3 text-gray-500 transition"
          tabIndex={-1}
        >
          {mostrarConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        <label
          htmlFor="confirmPassword"
          className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
        >
          Confirmar contraseña
        </label>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded-lg w-full hover:bg-blue-700 transition"
      >
        Registrarse
      </button>

      <div className="text-center text-sm mb-2 p-2">
        <button
          type="button"
          className="text-blue-500 hover:underline transition"
          onClick={() => navigate("/login")}
        >
          ¿Ya estoy registrado?
        </button>
      </div>
    </form>
  );
}
