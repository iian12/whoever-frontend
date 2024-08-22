import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from './components/NavBar';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import CreatePostPage from './components/CreatePostPage';
import SignUpPage from './components/SignUpPage'; // SignupPage 임포트
import { getToken } from './utils/auth';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = getToken();
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route
                    path="/login"
                    element={isLoggedIn ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />}
                />
                <Route
                    path="/signup"
                    element={isLoggedIn ? <Navigate to="/" /> : <SignUpPage />} // SignupPage 경로 추가
                />
                <Route
                    path="/profile"
                    element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/create-post"
                    element={isLoggedIn ? <CreatePostPage /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
};

export default App;
