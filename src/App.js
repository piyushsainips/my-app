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
import Profile from './component/profile';
import Quiz from './component/quiz';
import QuizPanel from './component/QuizPanel';
// import {app} from './firebase';
// import {getDatabase,ref,set} from 'firebase/database';
import DashboardUpdate from './component/dashboardupdate';
import UploadQuiz from './component/UploadQuiz';
import ManageQuizzes from './component/ManageQuizzes';
import Chatbot from './backend/chatbot';
import QuestionPaperList from "./component/QuestionPaperList";

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
                <Route path="/profile" element={<Profile />} /> {/* Add the Profile route */}
                <Route path="/Quiz" element={<Quiz />} /> {/* Add the Quiz route */}
                <Route path="/QuizPanel" element={<QuizPanel />} /> {/* Add the Home route */}                
                <Route path="/dashboardupdate" element={<DashboardUpdate />} /> {/* Add the Dashboard Update route */}
                <Route path="/uploadquiz" element={<UploadQuiz />} /> {/* Add the UploadQuiz route */}
                <Route path="/managequiz" element={<ManageQuizzes />} /> {/* Add the UploadQuiz route */}
                <Route path="/chatbot" element={<Chatbot />} /> {/* Add the Chatbot route */}
                <Route path="/QuestionPaperList" element={<QuestionPaperList />}/>

            </Routes>
        </Router>
    );
};

export default App;