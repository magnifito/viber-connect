import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// For GitHub Pages project sites the app is served from /<repo>/.
// Override with VITE_BASE when using a custom domain (set VITE_BASE=/).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? "/viber-button/",
});
