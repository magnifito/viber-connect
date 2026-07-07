import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@viberbutton/react/styles.css";
import "./styles.css";
import { App } from "./App.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
