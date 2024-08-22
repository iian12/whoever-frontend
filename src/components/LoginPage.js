// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css'; // 스타일을 위한 CSS 파일

const API_BASE_URL = 'YOUR_API_BASE_URL'; // API_BASE_URL을 실제 URL로 대체하세요.

const apiClient = axios.create({
    baseURL: API_BASE_URL,
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
                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
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
                    <a href="#">Forgot your password?</a>
                    <a href="#">Register</a>
                </div>
            </form>
        </div>
    );
};

export default Login;
