import React, { useState } from 'react';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { API_BASE_URL } from './apiConfig';
import './CreatePostPage.css';

const mdParser = new MarkdownIt();

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // 쿠키를 포함하도록 설정
});

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [suggestedTags, setSuggestedTags] = useState([]);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);

    const navigate = useNavigate();

    const handleEditorChange = ({ text }) => {
        setContent(text);
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
        const token = getAccessToken(); // 쿠키에서 토큰을 가져옴
        try {
            const response = await apiClient.post('/tags/suggest', { content }, {
                headers: { Authorization: `Bearer ${token}` }, // 헤더에 토큰 포함
            });

            setSuggestedTags(response.data.suggestedTags);
        } catch (err) {
            setError('Failed to get suggested tags');
        }
    };

    const handleGetDraft = async () => {
        const token = getAccessToken(); // 쿠키에서 토큰을 가져옴
        try {
            const response = await apiClient.post('/drafts/generate', { title, tags }, {
                headers: { Authorization: `Bearer ${token}` }, // 헤더에 토큰 포함
            });
            setContent(response.data.draft);
        } catch (err) {
            setError('Failed to generate draft');
        }
    };

    const handleImageUpload = async (event) => {
        const token = getAccessToken(); // 쿠키에서 토큰을 가져옴
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await apiClient.post('/images/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`, // 헤더에 토큰 포함
                    'Content-Type': 'multipart/form-data'
                },
            });
            const imageUrl = response.data.url;
            setContent(content + `\n![image](${imageUrl})\n`);
        } catch (err) {
            setError('Failed to upload image');
        }
    };

    const handleSubmit = async () => {
        const token = getAccessToken();
        console.log(token); // 쿠키에서 토큰을 가져옴
        if (!title.trim() || !content.trim()) {
            setError('Title and content cannot be empty.');
            return;
        }

        try {
            const response = await apiClient.post('/posts', { title, content, hashtagNames: tags }, {
                headers: { Authorization: `Bearer ${token}` }, // 헤더에 토큰 포함
            });

            const postId = response.data; // 서버로부터 받은 게시글 ID

            if (postId) {
                const isConfirmed = window.confirm('Post created successfully. Do you want to view the post?');
                if (isConfirmed) {
                    navigate(`/posts/${postId}`); // 해당 게시글 페이지로 리다이렉트
                }
            } else {
                alert('Post created successfully, but no post ID returned.');
            }
        } catch (err) {
            setError('Failed to create post');
        }
    };

    const getAccessToken = () => {
        return Cookies.get('accessToken'); // 쿠키에서 accessToken 가져오기
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
                <MdEditor
                    id="content"
                    value={content}
                    style={{ height: '500px' }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleEditorChange}
                />
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
                <label htmlFor="imageUpload">Upload Image</label>
                <input
                    type="file"
                    id="imageUpload"
                    onChange={handleImageUpload}
                />
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
