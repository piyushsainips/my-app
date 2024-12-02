import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './study.css';
import logoutTune from '../assest/intro_music.mp3';
import { getDatabase, ref, onValue, set } from 'firebase/database';

import notesIcon from '../assest/notes.jpeg';
import quizIcon from '../assest/quiz1.png';
import PYQIcon from '../assest/PYQ.jpg';
import profileIcon from '../assest/profile.jpeg';
import notificationIcon from '../assest/notification.png';
import WaitingScreen from './waiting';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [studentName, setStudentName] = useState('Student');
    const [isRegistered, setIsRegistered] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [profilePhotoURL, setProfilePhotoURL] = useState('');
    const [isWaiting, setIsWaiting] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        // if (!token) {
        //     // If no token exists, redirect to login
        //     navigate('/login');
        //     return;
        // }

        const studentId = localStorage.getItem('studentRoll_no'); // Assuming you store student ID in localStorage
        if (!studentId) return;

        const name = localStorage.getItem('studentName');
        const registered = localStorage.getItem('isRegistered');
        const profilePhoto = localStorage.getItem('profilePhotoURL');

        setIsLoggedIn(!!token);
        setIsRegistered(!!registered);
        if (name) setStudentName(name);
        if (profilePhoto) setProfilePhotoURL(profilePhoto);

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [navigate]);

    useEffect(() => {
        const studentId = localStorage.getItem('studentRoll_no');
        if (!studentId) return;

        const db = getDatabase();
        const notificationsRef = ref(db, `notifications/${studentId}`); // Fetch notifications for the logged-in student

        onValue(notificationsRef, (snapshot) => {
            if (snapshot.exists()) {
                const notificationsData = Object.values(snapshot.val());
                setNotifications(notificationsData);
                setUnreadCount(notificationsData.filter(notification => !notification.read).length); // Filter unread notifications
            }
        });
    }, []);

    const handleBeforeUnload = () => {
        localStorage.removeItem('isRegistered');
        localStorage.removeItem('studentName');
        localStorage.removeItem('authToken');
    };

    const handleLogout = () => {
        const audio = new Audio(logoutTune);
        audio.preload = 'auto';
        audio.play();

        setIsWaiting(true);

        setTimeout(() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('studentName');
            localStorage.removeItem('studentRoll_no'); // Clear studentId on logout

            setIsLoggedIn(false);
            setIsWaiting(false);
            navigate('/login');
        }, 5000);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setUnreadCount(0); // Reset unread count on open
    };

    const handleNotificationClick = (notification) => {
        // Mark notification as read in the database
        const studentId = localStorage.getItem('studentId');
        const db = getDatabase();
        const notificationRef = ref(db, `notifications/${studentId}/${notification.id}`);
        set(notificationRef, { ...notification, read: true });

        // Navigate to the linked page
        navigate(notification.link);
        setShowNotifications(false);
    };

    const handleNotesClick = () => {
        if (isLoggedIn) {
            navigate('/notes');
        } else {
            navigate('/login');
        }
    };

    const handleRegisterClick = () => {
        setIsWaiting(true);
        setTimeout(() => {
            setIsWaiting(false);
            navigate('/register');
        }, 1500);
    };

    const handleLoginClick = () => {
        setIsWaiting(true);
        setTimeout(() => {
            setIsWaiting(false);
            navigate('/login');
        }, 1500);
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleTitleClick = () => {
        navigate('/');
    };

    return (
        <>
            {isWaiting && <WaitingScreen />}

            <div className="title-container">
                <h1 className="title" onClick={handleTitleClick}>
                    <span>Knowledge</span> <span className="hub">Hub</span>
                </h1>
            </div>

            {!isRegistered && !isLoggedIn && (
                <div className="auth-buttons">
                    <button className="register" onClick={handleRegisterClick}>Register</button>
                    <button className="login" onClick={handleLoginClick}>Login</button>
                </div>
            )}

            {isLoggedIn && (
                <div className="profile-container">
                    <img
                        src={profilePhotoURL || profileIcon}
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

                    <img
                        src={notificationIcon}
                        alt="Notifications"
                        className="notification-icon"
                        onClick={toggleNotifications}
                    />
                    {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                    {showNotifications && (
                        <div className="notifications-dropdown animated-dropdown">
                            <h3>Notifications</h3>
                            {notifications.length > 0 ? (
                                notifications.map((notification, index) => (
                                    <div
                                        key={index}
                                        className="notification-item"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <p>{notification.message}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No new notifications</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="dashboard-container">
                <h1>Welcome, {studentName}!</h1>
                <h2>Select an option below to continue:</h2>

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
                        <button className="btn" onClick={() => navigate('/QuizPanel')}>Start Quiz</button>
                    </div>

                    <div className="option-card">
                        <img src={PYQIcon} alt="PYQ Icon" className="option-icon1" />
                        <h3>PYQ</h3>
                        <p>Get Previous Year Question Papers.</p>
                        <button className="btn" onClick={() => navigate('QuestionPaperList')}>PYQ Papers</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentDashboard;




