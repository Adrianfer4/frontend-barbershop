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
    // const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El correo no es válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    }
    //  else if (!passwordRegex.test(password)) {
    //   newErrors.password = "Mínimo 8 caracteres, incluye letras, números y símbolos";
    // }

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
      className="bg-white p-8 rounded-2xl shadow-xl  w-[300px] "
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="E-mail"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 -translate-y-1/3 text-gray-500"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div className="flex justify-between text-sm mb-4">
        <button
          type="button"
          className="text-blue-500 hover:underline"
          onClick={() => alert("Funcionalidad aún no implementada")}
        >
          ¿Olvidaste tu contraseña?
        </button>
        <button
          type="button"
          className="text-blue-500 hover:underline"
          onClick={() => navigate("/register")}
        >
          Registrarse
        </button>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-3 rounded-lg w-full hover:bg-blue-700 transition"
      >
        Iniciar sesión
      </button>
    </form>
  );
}
