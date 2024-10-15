import React, { useState } from 'react';
import './admit_login.css'; // Importing CSS for styling
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for redirection

const Admin = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        setError('');
        setSuccess(false);

        if (username === '' || password === '') {
            setError('Both fields are required.');
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);

            // Change this line to redirect to the dashboard page
            if (username === 'admin' && password === 'admin') {
                setSuccess(true);
                setError('');
                navigate('/dashboard'); // Redirect to the dashboard page on successful login
            } else {
                setError('Invalid username or password.');
            }
        }, 2000);
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Admin Login</h2>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">Login successful!</p>}

                <div className={`form-group  ${error ? 'input-error' : ''}`}>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className={`form-group${error ? 'input-error' : ''}`}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

export default Admin;
