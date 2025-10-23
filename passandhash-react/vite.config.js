import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wasm()],
  build: {
    target: "esnext", // Necesario para que top-level await funcione
  },
  optimizeDeps: {
    exclude: ["argon2-browser"], // Excluye argon2 de la pre-optimización de Vite
  },
});
