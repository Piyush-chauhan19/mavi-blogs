import React, { useContext, useRef, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CropModal from '../components/CropModal';

const CreateBlog = () => {
    const { user } = useContext(userDataContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    const [croppedBlob, setCroppedBlob] = useState(null);
    const [originalFilename, setOriginalFilename] = useState('');
    const navigate = useNavigate();

    const fileInputRef = useRef();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setOriginalFilename(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImage(reader.result);
                setCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedBlob) => {
        setCroppedBlob(croppedBlob);
        setCoverImage(new File([croppedBlob], originalFilename, { type: croppedBlob.type }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content || !coverImage) return alert("All fields are required!");

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('coverPic', coverImage);

        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/blog/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (res.status === 201) {
                alert('Blog created successfully!');
                navigate('/'); // redirect to homepage or blog list
            }
        } catch (err) {
            console.error(err);
            alert('Failed to create blog');
        } finally {
            setLoading(false);
        }
        navigate('/')
    };

    return (
        <div className='min-h-screen bg-gray-700 text-white pt-[140px] px-'>
            {/* Header */}
            <div className="fixed top-0 w-full z-50">
                {/* Green Header */}
                <div className="bg-green-900 w-full py-3 text-black text-2xl flex items-center justify-center relative ">
                    <Link
                        to="/"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl"
                    >
                        <i className="ri-home-line"></i>
                    </Link>
                    Mavi Jr Blogs

                    <Link to="/profile" className="absolute right-4 top-1/2 -translate-y-1/2">
                        <img
                            className="bg-red-500 rounded-full w-8 h-8 object-cover border"
                            src={`${import.meta.env.VITE_BASE_URL}/profilePictures/${user.profilePic}`}
                            alt=""
                        />
                    </Link>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-10 bg-gray-800 p-6 rounded-lg shadow-md border border-gray-600 flex flex-col gap-5">
                {/* Title */}
                <input
                    type="text"
                    placeholder="Enter blog title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="px-4 py-2 rounded bg-gray-400 text-black"
                />

                {/* Content */}
                <textarea
                    placeholder="Write your blog content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="px-4 py-2 h-52 resize-none rounded bg-gray-400 text-black"
                />

                {/* Image Upload */}
                <div
                    className="w-full h-48 border-2 border-dashed border-gray-400 rounded flex flex-col justify-center items-center gap-2 cursor-pointer bg-gray-900 hover:bg-gray-800 transition"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {croppedBlob ? (
                        <img
                            src={URL.createObjectURL(croppedBlob)}
                            alt="Preview"
                            className="h-full object-cover rounded"
                        />
                    ) : (
                        <>
                            <i className="ri-image-line text-3xl"></i>
                            <span>Click to upload a cover image</span>
                        </>
                    )}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    hidden
                    onChange={handleImageChange}
                />

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-700 hover:bg-green-800 text-white py-2 rounded transition disabled:opacity-50"
                >
                    {loading ? 'Posting...' : 'Post Blog'}
                </button>
            </form>

            {cropModalOpen && tempImage && (
                <CropModal
                    imageSrc={tempImage}
                    onClose={() => setCropModalOpen(false)}
                    aspectRatio={4 / 1}
                    onCropComplete={(blob) => {
                        setCroppedBlob(blob);
                        setCoverImage(new File([blob], originalFilename, { type: blob.type }));
                    }}
                />
            )}
        </div>
    );
};

export default CreateBlog;