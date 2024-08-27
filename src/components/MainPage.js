import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/apiConfig';
import './MainPage.css'; // CSS 파일 임포트
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

const MainPage = ({handleLogout}) => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await apiClient.get('/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Failed to load posts');
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        const checkTokenExpiry = () => {
            const refreshToken = Cookies.get('refreshToken');
            if (refreshToken) {
                const decodedToken = jwtDecode(refreshToken);
                const currentTime = Date.now() / 1000; // 현재 시간 (초 단위)
                const tokenExpTime = decodedToken.exp; // 만료 시간 (초 단위)

                // 만료 시간이 15분 이하 남았으면
                if (tokenExpTime - currentTime < 15 * 60) {
                    handleLogout(); // 로그아웃 상태로 변경
                }
            }
        };

        checkTokenExpiry();
    }, [handleLogout]);

    return (
        <div className="main-page-container">
            <h1>All Posts</h1>
            {error && <p className="error-message">{error}</p>}
            <ul className="posts-list">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <li key={post.id} className="post-item">
                            <Link to={`/posts/${post.id}`} className="post-link">
                                {/* 썸네일 이미지 추가 */}
                                {post.thumbnailUrl && (
                                    <div className="thumbnail-container">
                                        <img
                                            src={post.thumbnailUrl}
                                            alt={post.title}
                                            className="thumbnail-image"
                                        />
                                    </div>
                                )}
                                <div className="post-info">
                                    <h2>{post.title}</h2>
                                    <p className="author">By {post.authorNickname}</p>
                                    <p className="date">{new Date(post.createdAt).toLocaleString()}</p>
                                </div>
                            </Link>
                        </li>
                    ))
                ) : (
                    <p className="no-posts-message">No posts available</p>
                )}
            </ul>
        </div>
    );
};

export default MainPage;
