import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        apiClient
            .post('/auth/login', { username, password })
            .then((response) => {
                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                onLogin();
            })
            .catch((error) => {
                console.error('Login failed:', error);
            });
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;
