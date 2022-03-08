import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Unlighthose from "@unlighthouse/vite";
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({}),
  ],
});
