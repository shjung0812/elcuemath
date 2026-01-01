import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import MathCMS from './cms/MathCMS';
import QuillPage from './pages/QuillPage';
import './index.css';

function App() {
  return (
    <BrowserRouter basename="/renv">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/cms" replace />} />
          <Route path="cms" element={<MathCMS />} />
          <Route path="editor" element={<QuillPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
