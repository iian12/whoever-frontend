import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // CSS 파일 임포트

const NavBar = ({ isLoggedIn, onLogout }) => {
    return (
        <nav>
            <div>
                <Link to="/">Blog Logo</Link>
            </div>
            <div>
                {!isLoggedIn ? (
                    <>
                        <Link to="/signup">Sign Up</Link>
                        <Link to="/login">Login</Link>
                    </>
                ) : (
                    <>
                        <Link to="/new-post">새 글 작성</Link>
                        <Link to="/profile">Profile</Link>
                        <button onClick={onLogout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
