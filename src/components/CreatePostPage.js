import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL, API_BASE_IMAGE_URL } from './apiConfig';
import './CreatePostPage.css';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [markdown, setMarkdown] = useState('');
    const [tags, setTags] = useState([]);
    const fileInputRef = useRef(null);
    const [error, setError] = useState(null);
    const [isPreviewReady, setIsPreviewReady] = useState(false);

    const insertText = (text) => {
        const textarea = document.querySelector('.markdown-editor');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = markdown.substring(0, start);
        const after = markdown.substring(end, markdown.length);
        setMarkdown(`${before}${text}${after}`);
    };

    const navigate = useNavigate();

    useEffect(() => {
        setIsPreviewReady(true);
    }, [markdown]);

    const handleBold = () => {
        insertText('**텍스트**');
    };

    const handleItalic = () => {
        insertText('*텍스트*');
    };

    const handleStrikethrough = () => {
        insertText('~~텍스트~~');
    };

    const handleLink = () => {
        insertText('[링크 텍스트](https://example.com)');
    };

    const handleBlockquote = () => {
        insertText('> 인용문\n');
    };

    const handleHeading = (level) => {
        insertText(`${'#'.repeat(level)} 제목\n`);
    };

    const handleCode = () => {
        insertText('```\n코드블록\n```');
    };

    const handleImageUpload = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post(`${API_BASE_IMAGE_URL}/images/upload`, formData, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                        'Content-Type': 'multipart/form-data'
                    },
                });
                if (response.status === 200 && response.data.url) {
                    insertText(`![이미지 설명](${response.data.url})`);
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (err) {
                setError('Failed to upload image');
            }
        }
    };

    const handleSubmit = async () => {
        const token = Cookies.get('accessToken');
        if (!title.trim() || !markdown.trim()) {
            setError('Title and content cannot be empty.');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/posts`, {
                title,
                content: markdown,
                hashtagNames: tags
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const postId = response.data;
            if (postId) {
                const isConfirmed = window.confirm('Post created successfully. Do you want to view the post?');
                if (isConfirmed) {
                    navigate(`/posts/${postId}`);
                }
            } else {
                alert('Post created successfully, but no post ID returned.');
            }
        } catch (err) {
            setError('Failed to create post');
        }
    };

    const handleAddTag = (tag) => {
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const handleRemoveTag = (tag) => {
        setTags(tags.filter(t => t !== tag));
    };

    return (
        <div className="create-post-page">
            <div className="editor-section">
                <div className="editor-header">
                    <h1>제목을 입력하세요</h1>
                    <input
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="title-input"
                    />
                    <input
                        type="text"
                        placeholder="태그를 입력하세요 (Enter로 구분)"
                        className="tag-input"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag(e.target.value.trim());
                                e.target.value = '';
                            }
                        }}
                    />
                    <div className="tags-display">
                        {tags.map(tag => (
                            <span key={tag} className="tag">
                                {tag}
                                <button onClick={() => handleRemoveTag(tag)}>x</button>
                            </span>
                        ))}
                    </div>
                </div>
                <div className="editor-toolbar">
                    <button onClick={() => handleHeading(1)}>H1</button>
                    <button onClick={() => handleHeading(2)}>H2</button>
                    <button onClick={() => handleHeading(3)}>H3</button>
                    <button onClick={() => handleHeading(4)}>H4</button>
                    <button onClick={handleBold}>B</button>
                    <button onClick={handleItalic}>I</button>
                    <button onClick={handleStrikethrough}>~~</button>
                    <button onClick={handleLink}>Link</button>
                    <button onClick={handleCode}>Code Block</button>
                    <button onClick={handleBlockquote}>Quote</button>
                    <button onClick={handleImageUpload}>Image</button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{display: 'none'}}
                        onChange={handleFileChange}
                    />
                </div>
                <textarea
                    className="markdown-editor"
                    placeholder="당신의 이야기를 적어보세요..."
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                />
            </div>
            <div className="preview-section">
                <div className="preview-header">
                    <h1>{title}</h1>
                </div>
                <ReactMarkdown
                    children={markdown}
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                        blockquote({ children }) {
                            return <blockquote className="markdown-blockquote">{children}</blockquote>;
                        },
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={materialLight}
                                    language={match[1]}
                                    PreTag="div"
                                    className="markdown-code"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={`markdown-code ${className}`} {...props}>
                                    {children}
                                </code>
                            );
                        },
                        del({ children }) {
                            return <del>{children}</del>;
                        },
                    }}
                />
            </div>
            <button onClick={handleSubmit} className="submit-button">Submit</button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default CreatePostPage;
