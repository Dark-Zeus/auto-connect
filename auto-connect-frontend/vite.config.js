import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: [
      "chunk-23QYURXK",
      "chunk-6P42ARR4",
      "chunk-QC7EJAK4",
      "chunk-UZSTUZOU",
      "chunk-GDND277X",
      "chunk-UI2AT322",
      "chunk-YQVPGENK",
      "chunk-TDHS752F",
      "chunk-D2PLAWGQ",
      "chunk-FN45G42L",
      "chunk-JE7LBQU6",
      "chunk-GTQ4RQ3E",
      "chunk-P55PFNSL",
      "chunk-AO4QLYQ3",
      "chunk-KLSYPXTY",
      "chunk-XN3HZA2D",
      "chunk-YPSGIBTD",
      "chunk-VNPMCTXB",
    ],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    extensions: [".jsx", ".js", ".ts", ".tsx"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@css": path.resolve(__dirname, "./src/styles"),
      "@data": path.resolve(__dirname, "./src/data"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@services": path.resolve(__dirname, "./src/services"),
    },
  },
});
