import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { loadImage } from "./utils";
import "./index.css";

async function preload() {
  const resources = [
    await loadImage("/images/textbox.png"),
    await loadImage("/images/f.png"),
    await loadImage("/images/fc.png"),
    await loadImage("/images/mask.png"),
  ];

  await Promise.all(resources);

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App resources={resources} />
    </React.StrictMode>
  );
}

preload();
