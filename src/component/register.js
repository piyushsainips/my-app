import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css'; // Custom CSS for the registration form

const RegisterPage = () => {
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        number: '',
        branch: '',
        semester: ''
    });

    const [errors, setErrors] = useState({});
    const [showSecondSection, setShowSecondSection] = useState(false); // To toggle sections
    const [isTransitioning, setIsTransitioning] = useState(false); // For animation state

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateFirstSection = () => {
        let formErrors = {};
        if (!formData.name) formErrors.name = 'Name is required';
        if (!formData.surname) formErrors.surname = 'Surname is required';
        if (!formData.email) formErrors.email = 'Email is required';
        if (!formData.password) formErrors.password = 'Password is required';
        return formErrors;
    };

    const validateForm = () => {
        let formErrors = validateFirstSection();
        if (!formData.number) formErrors.number = 'Phone number is required';
        if (!formData.branch) formErrors.branch = 'Branch is required';
        if (!formData.semester) formErrors.semester = 'Semester is required';
        return formErrors;
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            // Registration successful, proceed
            localStorage.setItem('studentName', formData.name);
            localStorage.setItem('authToken', 'yourAuthTokenHere');
            localStorage.setItem('isRegistered', 'true');
            navigate('/');
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="register-container">
            <h2>Student Registration</h2>
            <form onSubmit={handleSubmit} className={`register-form1 ${isTransitioning ? 'transition' : ''}`}>
                {!showSecondSection ? (
                    <div className="first-section">
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
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />
                            {errors.email && <span className="error">{errors.email}</span>}
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
                        <button type="button" className="btn" onClick={handleContinue}>Continue</button>
                    </div>
                ) : (
                    <div className="second-section">
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
                        <button type="submit" className="btn">Create Account</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default RegisterPage;
