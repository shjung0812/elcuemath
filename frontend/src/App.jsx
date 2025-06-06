import { useState } from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import QuillPage from "./pages/QuillPage";
import NotFoundPage from "./pages/NotFound";
import EditorPage from "./pages/EditorPage";

// ReactQuill 기본 CSS 임포트
import "react-quill/dist/quill.core.css"; // Quill 핵심 스타일
import "react-quill/dist/quill.snow.css"; // Snow 테마 스타일

function App() {
  return (
    <BrowserRouter basename="/renv">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quill" element={<EditorPage />} />

        {/* ★★★ 여기에 404 라우트를 추가합니다. ★★★ */}
        {/* 모든 경로에 매치되지 않을 때 이 라우트가 렌더링됩니다. */}
        {/* 반드시 다른 모든 Route들보다 마지막에 위치해야 합니다! */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
