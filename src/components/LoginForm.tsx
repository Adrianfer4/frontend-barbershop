import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El correo no es válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Muestra mensaje de error debajo de los campos
        setErrors({
          ...errors,
          password: errorData.message || "Error al iniciar sesión",
        });

        setPassword("");
        return;
      }

      const data = await response.json();

      // Guardar token y datos del usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // Redirigir según el rol
      if (data.usuario.rol === "admin") {
        navigate("/adminPanel");
      } else {
        navigate("/inicio");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-xl w-[300px]"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

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
          className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
        >
          Correo electronico
        </label>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`peer h-12 w-full border rounded-lg px-3 pt-6 text-sm placeholder-transparent focus:outline-none focus:ring-2 ${
            errors.password
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-400"
          }`}
          placeholder="Contraseña"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-2 top-1/3 -translate-y-1/5 text-gray-500"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        <label
          htmlFor="password"
          className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
        >
          Contraseña
        </label>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-3 rounded-lg w-full hover:bg-blue-700 transition"
      >
        Iniciar sesión
      </button>

      <div className="text-center text-sm mb-2 p-2">
        <button
          type="button"
          className="text-blue-500 hover:underline"
          onClick={() => alert("Funcionalidad aún no implementada")}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
      <div className="text-center text-sm mb-4">
        <button
          type="button"
          className="text-blue-500 hover:underline"
          onClick={() => navigate("/register")}
        >
          Registrarse
        </button>
      </div>
    </form>
  );
}
