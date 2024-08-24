import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import NavBar from './components/NavBar';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import CreatePostPage from './components/CreatePostPage';
import SignUpPage from './components/SignUpPage';
import PasswordResetPage from './components/PasswordResetPage';
import Cookies from 'js-cookie';
import PostDetailPage from "./components/PostDetailPage"; // 쿠키에서 토큰을 가져오기 위한 라이브러리

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = Cookies.get('accessToken'); // 쿠키에서 토큰을 가져옴
        setIsLoggedIn(!!token); // 토큰이 있으면 로그인 상태로 설정
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        Cookies.remove('accessToken'); // 쿠키에서 토큰을 제거
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
                    element={isLoggedIn ? <Navigate to="/" /> : <SignUpPage />}
                />
                <Route
                    path="/reset-password"
                    element={isLoggedIn ? <Navigate to="/" /> : <PasswordResetPage />}
                />
                <Route
                    path="/profile"
                    element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/new-post"
                    element={isLoggedIn ? <CreatePostPage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/posts/:postId"
                    element={<PostDetailPage />}
                />
            </Routes>
        </Router>
    );
};

export default App;
