import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import './PasswordResetPage.css';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

const PasswordReset = () => {
    const [step, setStep] = useState(1); // 현재 단계를 추적
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        otp: '',
        newPassword: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSendOtp = (e) => {
        e.preventDefault();

        apiClient
            .post('/member/send-otp', { username: formData.username, email: formData.email })
            .then(() => {
                setSuccessMessage('OTP가 이메일로 전송되었습니다.');
                setError('');
                setStep(2); // 다음 단계로 이동
            })
            .catch((error) => {
                console.error('OTP 전송 오류:', error.response || error.message || error);
                setError('OTP 전송에 실패했습니다. 다시 시도해주세요.');
            });
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();

        apiClient
            .post('/member/verify-otp', { email: formData.email, otp: formData.otp }) // 이메일과 OTP만 전송
            .then(() => {
                setSuccessMessage('OTP가 확인되었습니다. 이제 비밀번호를 재설정할 수 있습니다.');
                setError('');
                setStep(3); // 비밀번호 재설정 단계로 이동
            })
            .catch((error) => {
                console.error('OTP 확인 오류:', error);
                setError('OTP가 유효하지 않습니다. 다시 시도해주세요.');
            });
    };

    const handleResetPassword = (e) => {
        e.preventDefault();

        apiClient
            .post('/member/reset-password', { email: formData.email, newPassword: formData.newPassword }) // 이메일과 비밀번호 전송
            .then(() => {
                setSuccessMessage('비밀번호가 성공적으로 재설정되었습니다! 이제 로그인할 수 있습니다.');
                setError('');
                setStep(4); // 완료 메시지 단계로 이동
            })
            .catch((error) => {
                console.error('비밀번호 재설정 오류:', error);
                setError('비밀번호 재설정에 실패했습니다. 다시 시도해주세요.');
            });
    };

    return (
        <div className="reset-container">
            <form onSubmit={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleResetPassword} className="reset-form">
                <h2>Password Reset</h2>
                <p>{step === 1 ? '사용자 이름과 이메일을 입력하여 OTP를 받으세요.' : step === 2 ? '이메일로 받은 OTP를 입력하세요.' : '새 비밀번호를 입력하세요.'}</p>

                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                {step === 1 && (
                    <>
                        <label>
                            Username
                            <input
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Email
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <button type="submit">Send OTP</button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <label>
                            OTP
                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter the OTP"
                                value={formData.otp}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <button type="submit">Verify OTP</button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <label>
                            New Password
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="Enter your new password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <button type="submit">Reset Password</button>
                    </>
                )}

                {step === 4 && (
                    <div className="login-link">
                        <Link to="/login">Go to Login</Link>
                    </div>
                )}
            </form>
        </div>
    );
};

export default PasswordReset;
