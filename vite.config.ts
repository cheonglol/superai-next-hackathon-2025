import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  resolve: {
    alias: {
      "@/core": path.resolve(__dirname, "./src/core"),
      "@/config": path.resolve(__dirname, "./src/config"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
      "@/http": path.resolve(__dirname, "./src/http"),
      "@/routes": path.resolve(__dirname, "./src/routes"),
      "@/controllers": path.resolve(__dirname, "./src/controllers"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/layout": path.resolve(__dirname, "./src/layout"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/store": path.resolve(__dirname, "./src/store"),
      "@/loaders": path.resolve(__dirname, "./src/loaders"),
    },
  },
});
