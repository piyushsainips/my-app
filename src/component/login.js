import React, { useState } from 'react';
import './login.css'; // Importing CSS for styling
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for redirection
import { app } from './firebase'; // Firebase app configuration
import { getDatabase, ref, get, child } from 'firebase/database'; // Firebase database methods
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage'; // Firebase storage methods

const Login = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [Roll_no, setRoll_no] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const [success, setSuccess] = useState(false); // Success state

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
    const fetchProfilePhoto = async (Roll_no) => {
        const storage = getStorage(app);
        const Roll_noKey = Roll_no;
        try {
            const profilePhotoRef = storageRef(storage, `profilePhotos/${Roll_noKey}`);
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
        if (Roll_no === '' || password === '') {
            setError('Both fields are required.');
            return;
        }

        // Roll_no validation
        if (!isValidRoll_no(Roll_no)) {
            setError('Please enter a valid Roll_no.');
            return;
        }

        // Simulating a login process
        setLoading(true);

        // Fetch the user data from Firebase
        const userData = await fetchUserData(Roll_no);

        setLoading(false); // Stop loading after the Firebase query completes

        if (userData) {
            // Check if the password matches
            if (password === userData.password) {
                // Fetch profile photo
                const profilePhotoURL = await fetchProfilePhoto(Roll_no);

                // Store necessary details in localStorage
                localStorage.setItem('authToken', 'example_token'); // Simulate token generation
                localStorage.setItem('studentName', userData.name);
                localStorage.setItem('studentRoll_no', Roll_no);
                localStorage.setItem('profilePhotoURL', profilePhotoURL || '');

                setSuccess(true);
                setError('');

                navigate('/'); // Redirect to the dashboard

                navigate('/'); // Redirect to the study page on successful login

            } else {
                setError('Invalid Roll_no or password.');
            }
        } else {
            setError('Invalid Roll_no or password.');
        }
    };

    return (
        <div className="login-container1">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Student Login</h2>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">Login successful!</p>}

                <div className={`form-group ${error ? 'input-error' : ''}`}>
                    <label>Roll_no:</label>
                    <input
                        type="text"
                        value={Roll_no}
                        onChange={(e) => setRoll_no(e.target.value)}
                        placeholder="Enter your Roll_no"
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
