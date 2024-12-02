import React, { useState } from 'react';
import './login.css'; // Importing CSS for styling
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for redirection
import { app } from './firebase'; // Firebase app configuration
import { getDatabase, ref, get, child } from 'firebase/database'; // Firebase database methods
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage'; // Firebase storage methods

const Login = () => {
    const navigate = useNavigate(); // Initialize the navigate function
<<<<<<< Updated upstream
    const [Roll_no, setRoll_no] = useState('');
=======
    const [rollNo, setRollNo] = useState(''); // Change from email to roll number
>>>>>>> Stashed changes
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const [success, setSuccess] = useState(false); // Success state

<<<<<<< Updated upstream
    // Roll_no validation function
    const isValidRoll_no = (Roll_no) => {
        return /\S/.test(Roll_no);
    };

    // Fetch user data from Firebase by Roll_no
    const fetchUserData = async (Roll_no) => {
        const dbRef = ref(getDatabase(app)); // Get the database reference
        try {
            // Replace "." in the Roll_no to match the database key format
            const Roll_noKey = Roll_no;
            const snapshot = await get(child(dbRef, `students/${Roll_noKey}`));
=======
    // Fetch user data from Firebase by roll number
    const fetchUserData = async (rollNo) => {
        const dbRef = ref(getDatabase(app)); // Get the database reference
        try {
            const snapshot = await get(child(dbRef, `students/${rollNo}`)); // Access data using roll number as the key
>>>>>>> Stashed changes

            if (snapshot.exists()) {
                return snapshot.val(); // Return the user data if found
            } else {
                return null; // Return null if no user data exists
            }
        } catch (error) {
            setError('Error fetching user data.');
            console.error('Error fetching data:', error);
            return null;
        }
    };

    // Fetch profile photo URL from Firebase Storage
<<<<<<< Updated upstream
    const fetchProfilePhoto = async (Roll_no) => {
        const storage = getStorage(app);
        const Roll_noKey = Roll_no;
        try {
            const profilePhotoRef = storageRef(storage, `profilePhotos/${Roll_noKey}`);
=======
    const fetchProfilePhoto = async (rollNo) => {
        const storage = getStorage(app);
        try {
            const profilePhotoRef = storageRef(storage, `profilePhotos/${rollNo}`);
>>>>>>> Stashed changes
            const url = await getDownloadURL(profilePhotoRef);
            return url;
        } catch (error) {
            console.error('Error fetching profile photo:', error);
            return null;
        }
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset any previous errors
        setError('');
        setSuccess(false);

        // Basic validation for empty fields
<<<<<<< Updated upstream
        if (Roll_no === '' || password === '') {
=======
        if (rollNo === '' || password === '') {
>>>>>>> Stashed changes
            setError('Both fields are required.');
            return;
        }

<<<<<<< Updated upstream
        // Roll_no validation
        if (!isValidRoll_no(Roll_no)) {
            setError('Please enter a valid Roll_no.');
            return;
        }

=======
>>>>>>> Stashed changes
        // Simulating a login process
        setLoading(true);

        // Fetch the user data from Firebase
<<<<<<< Updated upstream
        const userData = await fetchUserData(Roll_no);
=======
        const userData = await fetchUserData(rollNo);
>>>>>>> Stashed changes

        setLoading(false); // Stop loading after the Firebase query completes

        if (userData) {
            // Check if the password matches
            if (password === userData.password) {
                // Fetch profile photo
<<<<<<< Updated upstream
                const profilePhotoURL = await fetchProfilePhoto(Roll_no);
=======
                const profilePhotoURL = await fetchProfilePhoto(rollNo);
>>>>>>> Stashed changes

                // Store necessary details in localStorage
                localStorage.setItem('authToken', 'example_token'); // Simulate token generation
                localStorage.setItem('studentName', userData.name);
<<<<<<< Updated upstream
                localStorage.setItem('studentRoll_no', Roll_no);
=======
                localStorage.setItem('studentRollNo', rollNo);
>>>>>>> Stashed changes
                localStorage.setItem('profilePhotoURL', profilePhotoURL || '');

                setSuccess(true);
                setError('');

                navigate('/'); // Redirect to the dashboard
            } else {
<<<<<<< Updated upstream
                setError('Invalid Roll_no or password.');
            }
        } else {
            setError('Invalid Roll_no or password.');
=======
                setError('Invalid roll number or password.');
            }
        } else {
            setError('Invalid roll number or password.');
>>>>>>> Stashed changes
        }
    };

    return (
        <div className="login-container1">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Student Login</h2>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">Login successful!</p>}

                <div className={`form-group ${error ? 'input-error' : ''}`}>
<<<<<<< Updated upstream
                    <label>Roll_no:</label>
                    <input
                        type="text"
                        value={Roll_no}
                        onChange={(e) => setRoll_no(e.target.value)}
                        placeholder="Enter your Roll_no"
=======
                    <label>BTU Roll No.:</label>
                    <input
                        type="text"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        placeholder="Enter your BTU Roll No."
>>>>>>> Stashed changes
                        required
                    />
                </div>

                <div className={`form-group ${error ? 'input-error' : ''}`}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
