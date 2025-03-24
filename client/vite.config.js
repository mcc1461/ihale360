import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration with proxy to the backend
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3360, // Frontend running on port 3360
    proxy: {
      "/api": {
        target: "http://localhost:8360", // Proxy API requests to backend
        changeOrigin: true,
      },
    },
  },
});
