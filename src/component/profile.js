import React, { useState } from "react";
import "./profile.css"; // Assuming you have some CSS to style this

const Profile = () => {
  // State to manage editable fields
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    fullName: "Alexa Rawles",
    email: "alexarawles@gmail.com",
    gender: "",
    language: "",
    nickname: "",
    country: "",
    timezone: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-container1">
      <div className="header1">
        <h2>Welcome, Amanda</h2>
        <p>Tue, 07 June 2022</p>
      </div>
      <div className="profile-details1">
        <div className="profile-info1">
          <img
            src="profile-picture-url.jpg"
            alt="Profile"
            className="profile-picture1"
          />
          <h3>{user.fullName}</h3>
          <p>{user.email}</p>
          <button
            className="edit-btn1"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>

        <div className="form-fields1">
          <div className="field-row1">
            <div className="field1">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={user.fullName}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.fullName || "Your First Name"}</p>
              )}
            </div>
            <div className="field1">
              <label>Nick Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="nickname"
                  value={user.nickname}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.nickname || "Your First Name"}</p>
              )}
            </div>
          </div>

          <div className="field-row1">
            <div className="field1">
              <label>Gender</label>
              {isEditing ? (
                <input
                  type="text"
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.gender || "Your Gender"}</p>
              )}
            </div>
            <div className="field1">
              <label>Country</label>
              {isEditing ? (
                <input
                  type="text"
                  name="country"
                  value={user.country}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.country || "Your Country"}</p>
              )}
            </div>
          </div>

          <div className="field-row1">
            <div className="field1">
              <label>Language</label>
              {isEditing ? (
                <input
                  type="text"
                  name="language"
                  value={user.language}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.language || "Your Language"}</p>
              )}
            </div>
            <div className="field1">
              <label>Time Zone</label>
              {isEditing ? (
                <input
                  type="text"
                  name="timezone"
                  value={user.timezone}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.timezone || "Your Time Zone"}</p>
              )}
            </div>
          </div>
        </div>

        <div className="email-section1">
          <h4>My Email Address</h4>
          <p>{user.email}</p>
          <span>1 month ago</span>
          <button className="add-email-btn1">+Add Email Address</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
