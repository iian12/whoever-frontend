import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import Cookies from 'js-cookie';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import solarizedDark from "react-syntax-highlighter/dist/cjs/styles/hljs/solarized-dark";
import remarkGfm from 'remark-gfm';
import './PostDetailPage.css';

const apiClient = axios.create({
    baseURL: API_BASE_URL
});

const PostDetailPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [replyComment, setReplyComment] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = Cookies.get('accessToken');
            setIsAuthenticated(!!token);
            setToken(token);
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) {
                setError('Invalid post ID');
                return;
            }

            try {
                const response = await apiClient.get(`/posts/${postId}`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                    },
                    withCredentials: true
                });
                console.log("Fetched post data:", response.data);
                setPost(response.data);
            } catch (err) {
                console.error('API Error:', err);
                setError('Failed to fetch post details');
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId, token]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleReplyChange = (commentId, content) => {
        setReplyComment(prev => ({ ...prev, [commentId]: content }));
    };

    const handleCommentSubmit = async () => {
        try {
            const requestData = {
                postId: postId,
                content: newComment,
                parentCommentId: null
            };

            const response = await apiClient.post(`/comments`, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            setPost(prevPost => ({
                ...prevPost,
                comments: [response.data, ...prevPost.comments]
            }));
            setNewComment('');
        } catch (err) {
            console.error('Comment Post Error:', err);
            setError('Failed to post comment');
        }
    };

    const handleReplySubmit = async (parentCommentId) => {
        try {
            const requestData = {
                postId: postId,
                content: replyComment[parentCommentId],
                parentCommentId: parentCommentId
            };

            const response = await apiClient.post(`/comments`, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            setPost(prevPost => ({
                ...prevPost,
                comments: prevPost.comments.map(comment =>
                    comment.id === parentCommentId
                        ? { ...comment, replies: [response.data, ...comment.replies] }
                        : comment
                )
            }));
            setReplyComment(prev => ({ ...prev, [parentCommentId]: '' }));
        } catch (err) {
            console.error('Reply Post Error:', err);
            setError('Failed to post reply');
        }
    };

    const handleLike = async () => {
        try {
            await apiClient.post(`/posts/${postId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            setPost(prevPost => ({
                ...prevPost,
                liked: !prevPost.liked,
                likeCount: prevPost.liked ? prevPost.likeCount - 1 : prevPost.likeCount + 1
            }));
        } catch (err) {
            console.error('Like Post Error:', err);
            setError('Failed to like post');
        }
    };

    const renderComments = (comments) => {
        return comments.map((comment) => (
            <li key={comment.id} className="comment">
                <p><strong>{comment.authorNickname}</strong>:</p>
                <p>{comment.content}</p>
                <div className="reply-form">
                    <textarea
                        value={replyComment[comment.id] || ''}
                        onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                        placeholder="Add a reply..."
                    />
                    <button onClick={() => handleReplySubmit(comment.id)}>Submit Reply</button>
                </div>
                {comment.replies && comment.replies.length > 0 && (
                    <ul className="replies-list">
                        {renderComments(comment.replies)}
                    </ul>
                )}
            </li>
        ));
    };

    if (error) return <p className="error-message">{error}</p>;

    if (!post) return <p>Loading...</p>;

    return (
        <div className="post-detail-container">
            <h1>{post.title}</h1>
            <p className="post-meta">
                <span className="author">Author: {post.authorNickname}</span> |
                <span className="date">Created At: {new Date(post.createdAt).toLocaleString()}</span> |
                <span className="date">Updated At: {new Date(post.updatedAt).toLocaleString()}</span> |
                <span className="view-count">Views: {post.viewCount}</span> |
                <span className="comment-count">Comments: {post.commentCount}</span> |
                <span className="like-count">Likes: {post.likeCount}</span>
            </p>

            <div className="post-content">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={solarizedDark}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        }
                    }}
                >
                    {post.content}
                </ReactMarkdown>
            </div>

            <div className="hashtags-section">
                <h2>Hashtags</h2>
                <div className="hashtags-list">
                    {post.hashtags.map((hashtag) => (
                        <span key={hashtag.id} className="hashtag">
                            {hashtag.name}
                        </span>
                    ))}
                </div>
            </div>

            {post && (
                <button className="like-button" onClick={handleLike}>
                    {post.liked ? 'Unlike' : 'Like'}
                </button>
            )}

            <div className="comments-section">
                <h2>Comments</h2>
                {isAuthenticated && (
                    <div className="comment-form">
                        <textarea
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="Add a comment..."
                        />
                        <button onClick={handleCommentSubmit}>Submit</button>
                    </div>
                )}
                <ul className="comments-list">
                    {renderComments(post.comments)}
                </ul>
            </div>
        </div>
    );
};

export default PostDetailPage;
