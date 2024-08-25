import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

// refreshToken의 만료 시간 확인
const isRefreshTokenExpiringSoon = (token) => {
    try {
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000; // 현재 시간 (초 단위)
        const tokenExpTime = decodedToken.exp; // 만료 시간 (초 단위)

        // 만료 시간이 5분 이하 남았으면
        return tokenExpTime - currentTime < 5 * 60;
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
};

// 메인 페이지 로딩 시 호출
export const checkRefreshTokenExpiry = () => {
    const refreshToken = Cookies.get('refreshToken');
    if (refreshToken && isRefreshTokenExpiringSoon(refreshToken)) {
        // refreshToken이 만료될 때
        window.location.href = '/logout'; // 로그아웃 페이지로 리다이렉트
    }
};