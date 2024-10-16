import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './study.css'; // Importing CSS for styling

import { } from 'firebase/database'; // Firebase database
import { } from 'firebase/storage'; // Firebase storage

// Importing images from assets folder
import notesIcon from '../assest/notes.jpeg'; // Correct path for Notes image
import quizIcon from '../assest/quiz1.png'; // Correct path for Quiz image
import chatbotIcon from '../assest/ai_chat.png'; // Correct path for Chatbot image
import profileIcon from '../assest/profile.jpeg'; // Profile icon

// Import the WaitingScreen component
import WaitingScreen from './waiting';

const StudentDashboard = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const [studentName, setStudentName] = useState('Student'); // State for student name
    const [isRegistered, setIsRegistered] = useState(false); // State to track registration status
    const [showMenu, setShowMenu] = useState(false); // State to toggle profile dropdown menu
    const [profilePhotoURL, setProfilePhotoURL] = useState(''); // State for profile photo URL
    const [isWaiting, setIsWaiting] = useState(false); // State for waiting screen

    // Check if the user is logged in or registered
    useEffect(() => {
        const token = localStorage.getItem('authToken'); // Example: storing a token
        const name = localStorage.getItem('studentName'); // Fetch student name
        const registered = localStorage.getItem('isRegistered'); // Check if user has registered
        const profilePhoto = localStorage.getItem('profilePhotoURL'); // Fetch profile photo URL from localStorage

        setIsLoggedIn(!!token); // Update login status based on token presence
        setIsRegistered(!!registered); // Check if user has registered
        if (name) setStudentName(name); // Set student name if found
        if (profilePhoto) setProfilePhotoURL(profilePhoto); // Set profile photo if found

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
            navigate('/notes'); // Navigate to Notes if the user is logged in
        } else {
            navigate('/login'); // Redirect to Login if not logged in
        }
    };

    // const handleLoginClick = () => {
    //     navigate('/login'); // Navigate to the login page
    // };

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
        navigate('/profile'); // Navigate to the profile page
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
        setShowMenu(!showMenu); // Toggle the dropdown menu
    };

    const handleTitleClick = () => {
        navigate('/'); // Navigate to home or the main dashboard page
    };

    return (
        <>
            {/* Show Waiting Screen if isWaiting is true */}
            {isWaiting && <WaitingScreen />}
            
            {/* Styled title at the top left */}
            <h1 className="title" onClick={handleTitleClick}>
                <span>Knowledge</span> <span className="hub">Hub</span>
            </h1>

            {/* Show Register button if user is not registered and not logged in */}
            {!isRegistered && !isLoggedIn && (
                <div className="auth-buttons">
                    <button className="register" onClick={handleRegisterClick}>Register</button>
                </div>
            )}

            {/* Show Profile button if logged in */}
            {isLoggedIn && (
                <div className="profile-container">
                    <img
                        src={profilePhotoURL || profileIcon} // Use uploaded profile photo or fallback to default icon
                        alt="Profile"
                        className="profile-icon"
                        onClick={toggleMenu} // Toggle dropdown menu on click
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
                <h2>Welcome, {studentName}!</h2>
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
