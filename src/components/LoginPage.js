import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';
import { API_BASE_URL } from '../utils/apiConfig';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // 쿠키를 받기 위해 설정
});

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        apiClient
            .post('/auth/login', { username, password })
            .then((response) => {
                onLogin(); // 로그인 성공 시 호출
            })
            .catch((error) => {
                console.error('Login failed:', error);
                setError('로그인에 실패했습니다. 사용자 이름과 비밀번호를 확인하세요.'); // 에러 메시지 설정
            });
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Sign In</h2>
                <p>Enter your username and password to login.</p>
                {error && <div className="error-message">{error}</div>} {/* 에러 메시지 표시 */}
                <label>
                    Username
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Sign In</button>
                <div className="login-links">
                    <Link to="/reset-password">Forgot your password?</Link>
                    <Link to="/signup">Register</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
