import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: { alias: { "@": "/src" } },
  plugins: [react()],
  preview: {
    port: parseInt(process.env.PORT || "5173"),
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: ["jobs-portal-frontend-1080803823360.europe-west1.run.app", '*'],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://backend:3000", // local nest app
        changeOrigin: true,
      },
      "/uploads": {
        // folder with uploaded files
        target: "http://backend:3000",
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
  },
});
