import { useState } from 'react'
import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import QuillPage from './pages/QuillPage';

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
