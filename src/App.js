// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentDashboard from '../src/component/study';
import Notes from '../src/component/notes';
// import Quiz from './Quiz';
// import Chatbot from './Chatbot';
import Login from './component/login'; // Assuming you have a Login component
import RegisterPage from './component/register';
import WaitingScreen from './component/waiting';
import Admin from './component/admit_login';
import DashboardPage from './component/dashboard_page';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StudentDashboard />} />
                <Route path="/notes" element={<Notes />} />
                {/* <Route path="/quiz" element={<Quiz />} /> */}
                {/* <Route path="/chatbot" element={<Chatbot />} /> */}
                <Route path="/login" element={<Login />} /> {/* Add the Login route */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/waiting" element={<WaitingScreen />} />
                <Route path="/admin" element={<Admin />} /> {/* Add the Admin route */}
                <Route path="/dashboard" element={<DashboardPage />} /> {/* Add the Dashboard route */}

            </Routes>
        </Router>
    );
};

export default App;
