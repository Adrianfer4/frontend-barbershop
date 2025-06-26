import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['udigga-ip-181-199-42-73.tunnelmole.net'],
    host: true // importante si estás usando un túnel
  }
});
