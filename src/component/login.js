import React, { useState } from 'react';
import './login.css'; // Importing CSS for styling
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for redirection

const Login = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    // States to store email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const [success, setSuccess] = useState(false); // Success state

    // Email validation function
    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    // Handler for form submission
    const handleSubmit = (e) => {
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

        // Mocking a backend request
        setTimeout(() => {
            setLoading(false);

            // Fetching stored email and password from localStorage
            const storedEmail = localStorage.getItem('studentEmail');
            const storedPassword = localStorage.getItem('studentPassword');

            // Check if the entered email and password match the stored ones
            if (email === storedEmail && password === storedPassword) {
                setSuccess(true);
                setError('');
                navigate('/study'); // Redirect to the study page on successful login
            } else {
                setError('Invalid email or password.');
            }
        }, 2000);
    };

    return (
        <div className="login-container">
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
