import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, update } from "firebase/database"; // Import the update function
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes } from "firebase/storage";
import { app } from './firebase'; // Firebase configuration
import "./profile.css"; // Assuming you have some CSS to style this

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone_no: "",
    branch: "",
    surname: "",
    password: "",
    semester: "",
    profilePhotoURL: ""
  });
  const [newProfilePhoto, setNewProfilePhoto] = useState(null); // Store the new profile photo if uploaded

  // Fetch user data from Firebase when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const db = getDatabase(app);
        const storage = getStorage(app);
        
        // Assuming the user is identified by their email stored in localStorage
        const userEmail = localStorage.getItem('studentEmail');
        const userId = userEmail.replace('.', '_'); // Convert email to Firebase-friendly format

        // Fetch user data from the Realtime Database
        const userRef = ref(db, `students/${userId}`);
        const userSnapshot = await get(userRef);
        
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          setUser({
            name: userData.name,
            email: userData.email,
            phone_no: userData.number || "", // Default to empty string if data is missing
            branch: userData.branch || "",
            surname: userData.surname || "",
            password: userData.password || "",
            semester: userData.semester || "",
            profilePhotoURL: userData.profilePhotoURL || ""
          });

          // If profile photo URL exists, fetch the profile picture
          if (userData.profilePhotoURL) {
            const photoURL = await getDownloadURL(storageRef(storage, userData.profilePhotoURL));
            setUser(prevState => ({ ...prevState, profilePhotoURL: photoURL }));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "profilePhoto") {
      setNewProfilePhoto(e.target.files[0]); // Handle new profile photo upload
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true); // Show loading state while saving
      const db = getDatabase(app);
      const storage = getStorage(app);
      const userEmail = localStorage.getItem('studentEmail');
      const userId = userEmail.replace('.', '_');

      // If there's a new profile photo, upload it to Firebase Storage
      let profilePhotoURL = user.profilePhotoURL;
      if (newProfilePhoto) {
        const photoRef = storageRef(storage, `profilePhotos/${userId}`);
        await uploadBytes(photoRef, newProfilePhoto); // Upload new profile photo
        profilePhotoURL = await getDownloadURL(photoRef); // Get the new photo URL
      }

      // Update the user data in the Firebase Realtime Database
      await update(ref(db, `students/${userId}`), {
        name: user.name,
        surname: user.surname,
        number: user.phone_no,
        branch: user.branch,
        semester: user.semester,
        password: user.password,
        profilePhotoURL // Update the profile photo URL if changed
      });

      alert("Profile updated successfully!");

      // Reset the editing state
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-container1">
      <div className="header1">
        <h2>Welcome, {user.name}</h2>
      </div>
      <div className="profile-details1">
        <div className="profile-info1">
          <img
            src={user.profilePhotoURL || "default-profile-picture-url.jpg"}
            alt="Profile"
            className="profile-picture1"
          />
          <h3 className="name1">{user.name.surname}</h3>
          {/* <p>{user.email}</p> */}
          <button
            className="edit-btn1"
            onClick={() => {
              if (isEditing) {
                handleSave(); // Call save function when in editing mode
              } else {
                setIsEditing(true); // Switch to edit mode
              }
            }}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>

        {isEditing && (
          <div className="form-fields1">
            <div className="field-row1">
              <div className="field1">
                <label>Profile Photo</label>
                <input type="file" name="profilePhoto" onChange={handleChange} />
              </div>
            </div>
          </div>
        )}

        <div className="form-fields1">
          <div className="field-row1">
            <div className="field1">
              <label>Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.name || "Your First Name"}</p>
              )}
            </div>
            <div className="field1">
              <label>Surname</label>
              {isEditing ? (
                <input
                  type="text"
                  name="surname"
                  value={user.surname}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.surname || "Your Surname"}</p>
              )}
            </div>
          </div>

          <div className="field-row1">
            <div className="field1">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone_no"
                  value={user.phone_no}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.phone_no || "Your Phone Number"}</p>
              )}
            </div>
            <div className="field1">
              <label>Password</label>
              {isEditing ? (
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.password || "Your Password"}</p>
              )}
            </div>
          </div>

          <div className="field-row1">
            <div className="field1">
              <label>Branch</label>
              {isEditing ? (
                <input
                  type="text"
                  name="branch"
                  value={user.branch}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.branch || "Your Branch"}</p>
              )}
            </div>
            <div className="field1">
              <label>Semester</label>
              {isEditing ? (
                <input
                  type="text"
                  name="semester"
                  value={user.semester}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.semester || "Your Semester"}</p>
              )}
            </div>
          </div>
        </div>

        <div className="email-section1">
          <h4>My Email Address</h4>
          <p>{user.email}</p>
        </div>

      </div>
    </div>
  );
};

export default Profile;
