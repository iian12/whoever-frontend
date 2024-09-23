import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {API_BASE_URL} from '../utils/apiConfig';
import './NicknameSetUpPage.css'

const NicknameSetupPage = () => {
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_BASE_URL}/member/set-nickname`,
                {nickname},
                {withCredentials: true});
            if (response.status === 200) {
                navigate('/login'); // 닉네임 설정 후 로그인 콜백으로 이동
            }
        } catch (err) {
            setError('Nickname could not be set. Please try again.');
        }
    };

    return (
        <div className="nickname-setup-container">
            <form className="nickname-setup-form" onSubmit={handleSubmit}>
                <h1>Set Your Nickname</h1>
                <label htmlFor="nickname">Nickname</label>
                <input
                    id="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                />
                {error && <p>{error}</p>}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default NicknameSetupPage;
