import React, { useState } from 'react';
import './login.css'; // Importing CSS for styling
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for redirection
import { app } from './firebase'; // Firebase app configuration
import { getDatabase, ref, get, child } from 'firebase/database'; // Firebase database methods
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage'; // Firebase storage methods

const Login = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const [success, setSuccess] = useState(false); // Success state

    // Email validation function
    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    // Fetch user data from Firebase by email
    const fetchUserData = async (email) => {
        const dbRef = ref(getDatabase(app)); // Get the database reference
        try {
            // Replace "." in the email to match the database key format
            const emailKey = email.replace('.', '_');
            const snapshot = await get(child(dbRef, `students/${emailKey}`));

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
    const fetchProfilePhoto = async (email) => {
        const storage = getStorage(app);
        const emailKey = email.replace('.', '_');
        try {
            const profilePhotoRef = storageRef(storage, `profilePhotos/${emailKey}`);
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
        if (email === '' || password === '') {
            setError('Both fields are required.');
            return;
        }

        // Email validation
        if (!isValidEmail(email)) {
            setError('Please enter a valid email.');
            return;
        }

        // Simulating a login process
        setLoading(true);

        // Fetch the user data from Firebase
        const userData = await fetchUserData(email);

        setLoading(false); // Stop loading after the Firebase query completes

        if (userData) {
            // Check if the password matches
            if (password === userData.password) {
                // Fetch profile photo
                const profilePhotoURL = await fetchProfilePhoto(email);

                // Store necessary details in localStorage
                localStorage.setItem('authToken', 'example_token'); // Simulate token generation
                localStorage.setItem('studentName', userData.name);
                localStorage.setItem('studentEmail', email);
                localStorage.setItem('profilePhotoURL', profilePhotoURL || '');

                setSuccess(true);
                setError('');

                navigate('/'); // Redirect to the dashboard

                navigate('/'); // Redirect to the study page on successful login

            } else {
                setError('Invalid email or password.');
            }
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="login-container1">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Student Login</h2>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">Login successful!</p>}

                <div className={`form-group ${error ? 'input-error' : ''}`}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
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
