import React, { useState, useRef } from 'react';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { API_BASE_URL, API_BASE_IMAGE_URL } from './apiConfig';
import './CreatePostPage.css';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Include cookies in requests
});

const imageClient = axios.create({
    baseURL: API_BASE_IMAGE_URL,
    withCredentials: true,
})

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [suggestedTags, setSuggestedTags] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleEditorChange = (value) => {
        setContent(value || '');
    };

    const handleAddTag = (tag) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const handleRemoveTag = (tag) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleGetSuggestedTags = async () => {
        const token = getAccessToken(); // Retrieve token from cookies
        try {
            const response = await apiClient.post('/tags/suggest', { content }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuggestedTags(response.data.suggestedTags);
        } catch (err) {
            setError('Failed to get suggested tags');
        }
    };

    const handleGetDraft = async () => {
        const token = getAccessToken(); // Retrieve token from cookies
        try {
            const response = await apiClient.post('/drafts/generate', { title, tags }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContent(response.data.draft);
        } catch (err) {
            setError('Failed to generate draft');
        }
    };

    const handleImageUpload = async (file) => {
        const token = getAccessToken(); // Retrieve token from cookies
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await imageClient.post('/images/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            if (response.status === 200 && response.data.url) {
                return response.data.url; // 서버로부터 받은 이미지 URL을 반환
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            setError('Failed to upload image');
            return null;
        }
    };

    // 에디터의 이미지 업로드 버튼 클릭 시 호출될 함수
    const handleImageButtonClick = () => {
        fileInputRef.current.click(); // 숨겨진 파일 입력 요소를 클릭
    };

    // 파일이 선택되었을 때 호출될 함수
    const handleImageUploadChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = await handleImageUpload(file);
            if (imageUrl) {
                // 서버에서 받은 이미지 URL을 콘텐츠에 추가
                setContent((prevContent) => {
                    return prevContent + `\n![image](${imageUrl})\n`;
                });
            }
        }
    };

    const handleSubmit = async () => {
        const token = getAccessToken();
        if (!title.trim() || !content.trim()) {
            setError('Title and content cannot be empty.');
            return;
        }

        try {
            const response = await apiClient.post('/posts', { title, content, hashtagNames: tags }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const postId = response.data; // 서버 응답으로부터 포스트 ID를 가져옴

            if (postId) {
                const isConfirmed = window.confirm('Post created successfully. Do you want to view the post?');
                if (isConfirmed) {
                    navigate(`/posts/${postId}`); // 새로 생성된 포스트 페이지로 리디렉션
                }
            } else {
                alert('Post created successfully, but no post ID returned.');
            }
        } catch (err) {
            setError('Failed to create post');
        }
    };

    const getAccessToken = () => {
        return Cookies.get('accessToken'); // 쿠키에서 accessToken을 가져옴
    };

    return (
        <div className="create-post-container">
            <h1>Create a New Post</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="content">Content</label>
                <MDEditor
                    id="content"
                    value={content}
                    onChange={handleEditorChange}
                />
                {/* 숨겨진 파일 입력 요소 */}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImageUploadChange}
                />
                <button type="button" onClick={handleImageButtonClick}>
                    Upload Image
                </button>
            </div>
            <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <div className="tags-input">
                    {tags.map(tag => (
                        <span key={tag} className="tag">
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)}>x</button>
                        </span>
                    ))}
                    <input
                        id="tags"
                        type="text"
                        placeholder="Add a tag and press Enter"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value) {
                                handleAddTag(e.target.value);
                                e.target.value = '';
                            }
                        }}
                    />
                </div>
                <button onClick={handleGetSuggestedTags}>Get Suggested Tags</button>
                {suggestedTags.length > 0 && (
                    <div className="suggested-tags">
                        <p>Suggested Tags:</p>
                        {suggestedTags.map(tag => (
                            <span
                                key={tag}
                                className="suggested-tag"
                                onClick={() => handleAddTag(tag)}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="form-group">
                <button onClick={handleGetDraft}>Get AI Draft</button>
            </div>
            <div className="form-group">
                <button onClick={handleSubmit}>Create Post</button>
            </div>
        </div>
    );
};

export default CreatePostPage;
