import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./app/home/page";
import "./i18n/config.ts";
import "./index.css";

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Home />
    </React.StrictMode>,
  );