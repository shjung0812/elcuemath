import { useState } from 'react'
import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import QuillPage from './pages/QuillPage';
// ReactQuill 기본 CSS 임포트 (★★★ 이 부분이 가장 중요합니다 ★★★)
import 'react-quill/dist/quill.core.css'; // Quill 핵심 스타일
import 'react-quill/dist/quill.snow.css'; // Snow 테마 스타일
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> {/* "/" 경로에 Home 컴포넌트 렌더링 */}
        <Route path="/quill" element={<QuillPage />} /> 

      </Routes>
    </BrowserRouter>
  );
}

export default App
