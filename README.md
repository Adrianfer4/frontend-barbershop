# 💈 Jamaica Style - Frontend

Este proyecto es la interfaz web de la barbería **Jamayca Style**, desarrollada con React y TailwindCSS. Permite a los clientes registrarse, iniciar sesión, agendar citas y a los administradores gestionar servicios, productos y clientes.

## 🚀 Tecnologías Utilizadas

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## ✅ Funcionalidades Actuales

- [x] Autenticación con validación de formularios.
- [x] Redirección según el rol del usuario (`admin` o `cliente`).
- [x] Diseño moderno y responsivo con TailwindCSS.
- [x] Input de contraseña con visibilidad activable (icono "ojo").
- [x] Validación visual de errores en los inputs.

## 🛠️ Funcionalidades Planeadas

- [ ] Registro de nuevos clientes.
- [ ] Página de recuperación de contraseña.
- [ ] Panel de administrador (gestión de usuarios, servicios y productos).
- [ ] Página de inicio personalizada para el cliente.
- [ ] Integración con notificaciones automáticas.
- [ ] Reportes para el administrador.
- [ ] Animaciones y mejoras visuales (con Framer Motion u otras).

## 🔧 Instalación y Uso

1. Clona el repositorio:
   ```bash
   git clone git@github.com:Adrianfer4/frontend-barbershop.git
   cd frontend-barbershop
   ```

Instala las dependencias:
npm install

Inicia el servidor de desarrollo:
npm run dev

Accede en tu navegador a:
http://localhost:5173

🌐 Conexión con el Backend
El login y demás operaciones usan una API REST desarrollada con Node.js y MySQL. Asegúrate de que el backend esté en funcionamiento y que la URL esté correctamente configurada en el archivo services/auth.ts o en una variable de entorno si se decide centralizar.

Ejemplo de base URL en un archivo de servicio:
const API_URL = https://backend-barbershop-production-2f88.up.railway.app/api/;

🧑‍💻 Autores
Desarrollador principal: Nestor Fernandez
