import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const OAuth2Callback = ({ onLogin }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogin = () => {
            const accessToken = Cookies.get('accessToken');
            const refreshToken = Cookies.get('refreshToken');

            if (accessToken && refreshToken) {
                // 토큰이 존재하면 onLogin 함수 호출 (로그인 상태 업데이트)
                onLogin(accessToken);
                // 메인 페이지로 리다이렉트
                navigate('/');
            } else {
                // 토큰이 없으면 로그인 페이지로 리다이렉트
                navigate('/login');
            }
        };

        handleLogin();
    }, [navigate, onLogin]);

    return <div>Processing OAuth2 login...</div>;
};

export default OAuth2Callback;
