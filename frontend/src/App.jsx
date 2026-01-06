import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MentorCenter from './pages/MentorCenter/MentorCenter';
import StudentCenter from './pages/StudentCenter/StudentCenter';
// import ConnectionChoice from './pages/MentorCenter/ConnectionChoice'; // No longer used

import MentorCallWindow from './pages/MentorCenter/MentorCallWindow';

function App() {
    return (
        <Router basename="/renv">
            <Routes>
                <Route path="/" element={<MentorCenter />} />
                <Route path="/mentor" element={<MentorCenter />} />
                <Route path="/mentor/call/:studentId" element={<MentorCallWindow />} />
                <Route path="/student" element={<StudentCenter />} />
                <Route path="*" element={<MentorCenter />} />
                {/* <Route path="/switch-connect" element={<ConnectionChoice />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
