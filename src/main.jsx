import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Vite PWA
import { registerSW } from "virtual:pwa-register";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//    Service Worker
// auto update   (3600000 ms)
const updateSW = registerSW({
  onNeedRefresh() {
    if (
      confirm("🚀 A new version is available, do you want to update the game?")
    ) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("✅ The game is ready to work offline");
  },
});
