// apiClient.js
import axios from 'axios';
import Cookies from 'js-cookie';
import {API_BASE_URL} from "./apiConfig";

const apiClient = axios.create({
    baseURL: API_BASE_URL
});

const getNewAccessToken = async () => {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    try {
        const response = await axios.post('/refresh', {}, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        });
        const { accessToken } = response.data;
        Cookies.set('accessToken', accessToken);
        return accessToken;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        throw error;
    }
};

apiClient.interceptors.request.use(
    async (config) => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response } = error;
        if (response && response.status === 401) {
            // Access token이 만료되었을 때
            try {
                const newAccessToken = await getNewAccessToken();
                // 요청 헤더를 새로 업데이트하고 요청을 다시 시도
                error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return apiClient.request(error.config);
            } catch (e) {
                return Promise.reject(e);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
