import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './apiConfig';
import './MainPage.css'; // CSS 파일 임포트

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

const MainPage = () => {
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

    return (
        <div className="main-page-container">
            <h1>All Posts</h1>
            {error && <p className="error-message">{error}</p>}
            <ul className="posts-list">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <li key={post.id} className="post-item">
                            <h2>{post.title}</h2>
                            <p className="author">By {post.authorNickname}</p>
                            <p className="date">{new Date(post.createdAt).toLocaleString()}</p>
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
