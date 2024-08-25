import Cookies from 'js-cookie';

// 토큰을 쿠키에서 가져오는 함수
export const getToken = () => Cookies.get('accessToken');

// 토큰을 쿠키에 설정하는 함수
export const setToken = (token) => Cookies.set('accessToken', token);

// 쿠키에서 토큰을 제거하는 함수
export const removeToken = () => Cookies.remove('accessToken');
