import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Unlighthose from "@unlighthouse/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Unlighthose({
      scanner: {
        device: "desktop",
      },
    }),
  ],
});
