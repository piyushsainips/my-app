import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css'; // Custom CSS for the registration form
import { app } from './firebase'; // Firebase app configuration
import { getDatabase, ref, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage
import Loading from './waiting1'; // Import the Loading component
import logoutTune from '../assest/intro_music.mp3'; // Import the MP3 file
import { get } from 'firebase/database';


const RegisterPage = () => {
  const navigate = useNavigate(); // For navigation after successful registration
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    Roll_no: '',
    password: '',
    number: '',
    branch: '',
    semester: '',
    college: '', // New field for college
    profilePhoto: null // Field for profile photo
  });

  const [errors, setErrors] = useState({}); // For form validation
  const [showSecondSection, setShowSecondSection] = useState(false); // To toggle sections
  const [isTransitioning, setIsTransitioning] = useState(false); // For animation state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    if (e.target.name === 'profilePhoto') {
      setFormData({
        ...formData,
        profilePhoto: e.target.files[0], // Handle profile photo upload
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const validateFirstSection = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = 'Name is required';
    if (!formData.surname) formErrors.surname = 'Surname is required';
    if (!formData.number) formErrors.number = 'Phone number is required';
      if (!formData.password) formErrors.password = 'Password is required';
    return formErrors;
  };

  const validateForm = () => {
    let formErrors = validateFirstSection();
    if (!formData.number) formErrors.number = 'Phone number is required';
    if (!formData.Roll_no) {
      formErrors.Roll_no = 'Roll_no is required';
    } else if (!/^\d{7}$/.test(formData.Roll_no)) {
      formErrors.Roll_no = 'Roll_no must be of 6 digits';
    }
    if (!formData.branch) formErrors.branch = 'Branch is required';
    if (!formData.semester) formErrors.semester = 'Semester is required';
    if (!formData.college) formErrors.college = 'College is required'; // Validate college
    return formErrors;
  };

  const isRollNoUnique = async (rollNo) => {
    const db = getDatabase(app);
    const rollNoRef = ref(db, `students/${rollNo}`);
    const snapshot = await get(rollNoRef);
    return !snapshot.exists(); // Returns true if Roll_no is unique, false otherwise
  };
  

  const handleContinue = () => {
    const validationErrors = validateFirstSection();
    if (Object.keys(validationErrors).length === 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setShowSecondSection(true);
        setIsTransitioning(false);
      }, 500); // Duration of animation
    } else {
      setErrors(validationErrors);
    }
  };

  const registerUserInDatabase = async () => {
    const db = getDatabase(app);
    const storage = getStorage(app);

    const userId = formData.Roll_no
    let profilePhotoURL = '';

    if (formData.profilePhoto) {
      const photoRef = storageRef(storage, `profilePhotos/${userId}`);
      await uploadBytes(photoRef, formData.profilePhoto); // Upload the photo
      profilePhotoURL = await getDownloadURL(photoRef); // Get the URL of the uploaded photo
    }

    await set(ref(db, `students/${userId}`), {
      name: formData.name,
      surname: formData.surname,
      Roll_no: formData.Roll_no,
      password: formData.password,
      number: formData.number,
      branch: formData.branch,
      semester: formData.semester,
      college: formData.college, // Save college in the database
      profilePhotoURL // Store the profile photo URL
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true); // Show loading screen

<<<<<<< Updated upstream
    const audio = new Audio(logoutTune); // Play the MP3 audio
    audio.loop = true; // Loop the audio until process finishes
    audio.preload = 'auto'; // Preload the audio for instant playback
    
    try {
      audio.play(); // Play the sound
      const isUnique = await isRollNoUnique(formData.Roll_no);
      if (!isUnique) {
        setErrors({ Roll_no: 'This Roll_no is already in use.' });
        setIsLoading(false); // Hide loading screen
        return;
      }

      await registerUserInDatabase(); // Register the user in the database
      localStorage.setItem('studentName', formData.name);
      localStorage.setItem('authToken', 'yourAuthTokenHere'); // Simulating login token
      localStorage.setItem('isRegistered', 'true'); // Mark user as registered
      localStorage.setItem('studentRoll_no', formData.Roll_no);
=======
      const audio = new Audio(logoutTune); // Play the MP3 audio
      audio.loop = true; // Loop the audio until process finishes
      audio.preload = 'auto'; // Preload the audio for instant playback
      audio.play(); // Play the sound

      try {
        await registerUserInDatabase(); // Register the user in the database
        localStorage.setItem('studentName', formData.name);
        localStorage.setItem('authToken', 'yourAuthTokenHere'); // Simulating login token
        localStorage.setItem('isRegistered', 'true'); // Mark user as registered
        localStorage.setItem('studentEmail', formData.email);
>>>>>>> Stashed changes

        audio.pause(); // Stop the audio when registration is successful
        navigate('/'); // Navigate to the dashboard after successful registration
      } catch (error) {
        console.error("Error during registration:", error);
        setErrors({ submit: "Registration failed. Please try again." });
      } finally {
        audio.pause(); // Stop the audio regardless of success or failure
        setIsLoading(false); // Hide loading screen
      }
    } else {
      setErrors(validationErrors); // Show validation errors
    }
  };

  return (
    <div className="register-container">
      {/* Conditionally render the Loading component */}
      {isLoading && <Loading message="Creating your account, please wait..." />}

      <h2>Student Registration</h2>
      <form onSubmit={handleSubmit} className={`register-form1 ${isTransitioning ? 'transition' : ''}`}>
        {!showSecondSection ? (
          <div className="first-section">
            {/* First section fields */}
            <div className="form-group1">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="form-group1">
              <label>Surname</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                placeholder="Enter your surname"
              />
              {errors.surname && <span className="error">{errors.surname}</span>}
            </div>
            <div className="form-group1">
              <label>Phone Number</label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
              {errors.number && <span className="error">{errors.number}</span>}
            </div>
            <div className="form-group1">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <button type="button" className="btn1" onClick={handleContinue}>Continue</button>
          </div>
        ) : (
          <div className="second-section">
            {/* Second section fields */}
            <div className="form-group1">
              <label>Roll_no</label>
              <input
                type="text"
                name="Roll_no"
                value={formData.Roll_no}
                onChange={handleChange}
                placeholder="Enter your Roll_no"
              />
              {errors.Roll_no && <span className="error">{errors.Roll_no}</span>}
            </div>
            <div className="form-group1">
              <label>Branch</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="Enter your branch"
              />
              {errors.branch && <span className="error">{errors.branch}</span>}
            </div>
            <div className="form-group1">
              <label>Semester</label>
              <input
                type="text"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                placeholder="Enter your semester"
              />
              {errors.semester && <span className="error">{errors.semester}</span>}
            </div>
            <div className="form-group1">
              <label>College Id</label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Enter your college"
              />
              {errors.college && <span className="error">{errors.college}</span>}
            </div>
            <div className="form-group1">
              <label>Profile Photo</label>
              <input
                type="file"
                name="profilePhoto"
                onChange={handleChange}
                accept="image/*"
              />
            </div>
            {errors.submit && <span className="error">{errors.submit}</span>}
            <button type="submit" className="btn2">Create Account</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterPage;
