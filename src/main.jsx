import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { loadImage, getImageUrl } from "./utils";
import "./index.css";

async function preload() {
  const resources = [
    await loadImage(getImageUrl("/images/f.png")),
    await loadImage(getImageUrl("/images/fc.png")),
    await loadImage(getImageUrl("/images/mask.png")),
  ];

  await Promise.all(resources);

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App resources={resources} />
    </React.StrictMode>
  );
}

preload();
