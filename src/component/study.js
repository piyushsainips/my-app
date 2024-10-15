// src/components/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './study.css'; // Importing CSS for styling

// Importing images from assets folder
import notesIcon from '../assest/notes.jpeg'; // Corrected path
import quizIcon from '../assest/quiz1.png';
import chatbotIcon from '../assest/ai_chat.png';
import profileIcon from '../assest/profile.jpeg';

// Import the WaitingScreen component
import WaitingScreen from './waiting';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [studentName, setStudentName] = useState('Student');
    const [isRegistered, setIsRegistered] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false); // State for waiting screen

    // Check if the user is logged in or registered
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const name = localStorage.getItem('studentName');
        const registered = localStorage.getItem('isRegistered');

        setIsLoggedIn(!!token);
        setIsRegistered(!!registered);
        if (name) setStudentName(name);

        // Event listener to clear registration data when the page is reloaded or closed
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup the event listener when component unmounts
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // Handle clearing registration data before the page unloads (reload/close)
    const handleBeforeUnload = () => {
        localStorage.removeItem('isRegistered');
        localStorage.removeItem('studentName');
        localStorage.removeItem('authToken');
    };

    const handleNotesClick = () => {
        if (isLoggedIn) {
            navigate('/notes');
        } else {
            navigate('/login');
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        // Show waiting screen before navigating
        setIsWaiting(true);
        // Simulate loading time (e.g., 1.5 seconds)
        setTimeout(() => {
            setIsWaiting(false);
            navigate('/register');
        }, 1500);
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLogout = () => {
        // Show waiting screen before logging out
        setIsWaiting(true);
        // Simulate logout processing time (e.g., 1.5 seconds)
        setTimeout(() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('studentName');
            setIsLoggedIn(false);
            setIsWaiting(false);
            navigate('/login');
        }, 1500);
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleTitleClick = () => {
        navigate('/');
    };

    return (
        <>
            {/* Show Waiting Screen if isWaiting is true */}
            {isWaiting && <WaitingScreen />}

            {/* Styled title at the top left */}
            <h1 className="title" onClick={handleTitleClick}>
                <span>Knowledge</span> <span className="hub">Hub</span>
            </h1>

            {/* Show Register button if user is not registered, otherwise show Login button */}
            {!isRegistered ? (
                <div className="auth-buttons">
                    <button className="register" onClick={handleRegisterClick}>Register</button>
                </div>
            ) : !isLoggedIn && (
                <div className="auth-buttons">
                    <button className="login" onClick={handleLoginClick}>Login</button>
                </div>
            )}

            {/* Show Profile button if logged in */}
            {isLoggedIn && (
                <div className="profile-container">
                    <img
                        src={profileIcon}
                        alt="Profile"
                        className="profile-icon"
                        onClick={toggleMenu}
                    />
                    {showMenu && (
                        <div className="dropdown-menu">
                            <button onClick={handleProfileClick}>Profile</button>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            )}

            {/* Dashboard Content */}
            <div className="dashboard-container">
                <h2 className='h2'>Welcome, {studentName}!</h2>
                <p>Select an option below to continue:</p>

                {/* Options for Notes, Quiz, and Chatbot */}
                <div className="options-container">
                    <div className="option-card">
                        <img src={notesIcon} alt="Notes Icon" className="option-icon" />
                        <h3>Notes</h3>
                        <p>Access your study materials, lecture notes, and resources here.</p>
                        <button className="btn" onClick={handleNotesClick}>Go to Notes</button>
                    </div>

                    <div className="option-card">
                        <img src={quizIcon} alt="Quiz Icon" className="option-icon" />
                        <h3>Quiz</h3>
                        <p>Test your knowledge by taking quizzes on various subjects.</p>
                        <button className="btn" onClick={() => navigate('/quiz')}>Start Quiz</button>
                    </div>

                    <div className="option-card">
                        <img src={chatbotIcon} alt="Chatbot Icon" className="option-icon" />
                        <h3>Chatbot</h3>
                        <p>Ask the chatbot any questions you have, and get instant help.</p>
                        <button className="btn" onClick={() => navigate('/chatbot')}>Chat Now</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentDashboard;
