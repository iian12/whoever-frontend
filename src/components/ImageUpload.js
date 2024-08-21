import React from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

const ImageUpload = ({ onImageUpload }) => {
    const fileInputRef = React.createRef();

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);

        const uploadedImages = await Promise.all(
            files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);

                const response = await axios.post('/api/v1/images/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${getToken()}`,
                    },
                });

                return response.data.url;
            })
        );

        onImageUpload(uploadedImages);
    };

    return (
        <>
            <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageUpload}
            />
            <button onClick={handleButtonClick}>Upload Images</button>
        </>
    );
};

export default ImageUpload;
