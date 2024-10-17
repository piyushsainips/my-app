/// src/components/Loading.js
import React from 'react';
import './waiting1.css'; // Import the CSS for the loading animation

const Loading = ({ message }) => {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <h1 className="waiting-title">
          <span>Knowledge</span> <span className="hub">Hub</span>
        </h1>
        <p className="p1">{message}</p>
      </div>
    </div>
  );
};

export default Loading;

