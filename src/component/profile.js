import React, { useState } from 'react';
import './profile.css'; // Optional: For styling the component

const ProfilePage = () => {
  // Sample user data (this could be fetched from a backend or state management system)
  const [user, setUser] = useState({
    profilePic: 'https://via.placeholder.com/150', // Placeholder image
    name: 'John Doe',
    branch: 'Computer Science',
    email: 'johndoe@example.com',
    phone: '+1 234 567 8901',
    password: '********',
    semester: '5th',
  });

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Picture */}
        <div className="profile-pic">
          <img src={user.profilePic} alt="Profile" />
        </div>

        {/* Profile Details */}
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p><strong>Branch:</strong> {user.branch}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Password:</strong> {user.password}</p>
          <p><strong>Semester:</strong> {user.semester}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
