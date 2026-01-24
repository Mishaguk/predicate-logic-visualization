import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./theme.css";
import App from "./App.tsx";
import "./localization/i18n.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
