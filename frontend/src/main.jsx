import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-quill/dist/quill.snow.css"; // ✨ 수정된 줄: 'quill.snow.css'로 경로를 변경했습니다.

import App from "./App.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
