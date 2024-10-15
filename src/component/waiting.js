// src/components/WaitingScreen.jsx
import React from 'react';
import './waiting.css'; // Import CSS for styling

const WaitingScreen = () => {
    return (
        <div className="waiting-overlay">
            <div className="waiting-content">
                <h1 className="waiting-title"> <span>Knowledge</span> <span className='hub'> Hub</span></h1>
                <div className="spinner"></div>
            </div>
        </div>
    );
};

export default WaitingScreen;
