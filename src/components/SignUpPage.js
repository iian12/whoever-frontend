import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import './SignUpPage.css';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        nickname: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        apiClient
            .post('/member/register', formData)
            .then(() => {
                setSuccessMessage('Registration successful! You can now log in.');
                setFormData({
                    username: '',
                    password: '',
                    email: '',
                    nickname: '',
                });
                setError('');
            })
            .catch((error) => {
                console.error('Error during signup:', error);
                setError('Failed to sign up. Please check your details and try again.');
            });
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
                <h2>Sign Up</h2>
                <p>Create your account by filling out the information below.</p>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <label>
                    Username
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Nickname
                    <input
                        type="text"
                        name="nickname"
                        placeholder="Enter your nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit">Sign Up</button>

                <div className="login-link">
                    Already have an account? <Link to="/login">Log in</Link>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
