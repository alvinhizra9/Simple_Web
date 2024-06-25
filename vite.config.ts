import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), , tsconfigPaths()],
  preview: {
    port: 36849,
    strictPort: true,
  },
  server: {
    port: 36849,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:8080",
  },
});
