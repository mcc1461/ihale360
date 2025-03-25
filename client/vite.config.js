import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Kullanıcı tanımlı proxy hedefi veya varsayılan localhost backend
const backendUrl = process.env.VITE_APP_API_URL || "http://localhost:8360";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3360, // Vite frontend portu
    host: "0.0.0.0", // Tüm arayüzlerden gelen istekleri kabul eder
    strictPort: true,
    allowedHosts: ["ihale360.site"], // Bu domain üzerinden gelen istekleri kabul et
    proxy: {
      "/api": {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
          if (id.includes("components")) return "components";
          if (id.includes("pages")) return "pages";
        },
      },
    },
  },
  base: "/", // Gerekirse CDN yoluyla değiştirilebilir
});
