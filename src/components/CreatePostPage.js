import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import ImageUpload from './ImageUpload';
import { getToken } from '../utils/auth';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImage] = useState([]);

    const handleSubmit = async () => {
        const postData = {
            title,
            content,
            images,
        };

        try {
            await axios.post('/api/v1/posts', postData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            window.location.href = '/';
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleImageUpload = (uploadedImages) => {
        const imageMarkdown = uploadedImages
            .map((url) => `![](${url})`)
            .join('\n');
        setContent((prevContent) => `${prevContent}\n${imageMarkdown}`);
    };

    return (
        <div>
            <h2>Create a New Post</h2>
            <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Write your markdown content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <ImageUpload onImageUpload={handleImageUpload} />
            <button onClick={handleSubmit}>Submit Post</button>

            <h3>Preview:</h3>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
};

export default CreatePostPage;
