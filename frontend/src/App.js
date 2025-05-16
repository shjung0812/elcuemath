import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import MathContentEditor from './pages/MathContentEditor';
function App() {
  return (
    <Router>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matheditor" element={<MathContentEditor />} />

        </Routes>
    </Router>
  );
}



export default App;