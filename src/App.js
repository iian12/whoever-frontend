import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import NavBar from './components/NavBar';
import MainPage from './components/MainPage';
import Login from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import CreatePostPage from './components/CreatePostPage';
import SignUpPage from './components/SignUpPage';
import OAuth2Callback from "./components/OAuth2Callback";
import PasswordResetPage from './components/PasswordResetPage';
import NicknameSetUpPage from './components/NicknameSetUpPage';
import Cookies from 'js-cookie';
import PostDetailPage from "./components/PostDetailPage";

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
        localStorage.removeItem('accessToken');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken'); // 쿠키에서 토큰을 제거
        setIsLoggedIn(false);
        window.location.href = '/';
    };

    const onLogin = (accessToken) => {
        // accessToken으로 로그인 상태를 처리
        localStorage.setItem('accessToken', accessToken);
        setIsLoggedIn(true);
    };

    return (
        <Router>
            <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route
                    path="/login"
                    element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
                />
                <Route
                    path="/login/callback" element={<OAuth2Callback onLogin={onLogin}/>}
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
                <Route
                    path="/signup/nickname" // 닉네임 설정 페이지 경로 추가
                    element={<NicknameSetUpPage />}
                />
            </Routes>
        </Router>
    );
};

export default App;
