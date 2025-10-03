import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    glsl(),
    VitePWA({
      registerType: "autoUpdate", // auto update
      includeAssets: [
        "icons8-pumbaa-192.png",
        "R.png",
        "icons8-pumbaa-192.png",
        "icons8-pumbaa-480.png",
      ],
      manifest: {
        name: "Wild Race",
        short_name: "WildRace",
        description: "لعبة سباق ثلاثية الأبعاد تعمل أوف لاين",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        orientation: "landscape",
        start_url: ".",
        icons: [
          {
            src: "icons8-pumbaa-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons8-pumbaa-480.png",
            sizes: "480x480",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
