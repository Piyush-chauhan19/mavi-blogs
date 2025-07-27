import React, { useContext, useEffect, useRef, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CropModal from '../components/CropModal';

const EditBlog = () => {
    const { user } = useContext(userDataContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [existingCoverPic, setExistingCoverPic] = useState('');
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    const [croppedBlob, setCroppedBlob] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_BASE_URL}/blog/${id}`)
            .then((res) => {
                const blog = res.data;
                if (user._id !== blog.author._id) {
                    navigate('/unauthorized');
                } else {
                    setTitle(blog.title);
                    setContent(blog.content);
                    setExistingCoverPic(blog.coverPic);
                }
            })
            .catch((err) => {
                console.error(err);
                navigate('/unauthorized');
            });
    }, [id, user, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setTempImage(reader.result);
            reader.readAsDataURL(file);
            setCropModalOpen(true);
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (croppedBlob) {
            const file = new File([croppedBlob], 'cover-pic.jpg', { type: croppedBlob.type });
            formData.append('coverPic', file);
        }

        try {
            await axios.patch(`${import.meta.env.VITE_BASE_URL}/blog/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate(`/blog/${id}`);
        } catch (err) {
            console.error(err);
            alert('Failed to update blog');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this blog?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/blog/delete/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Failed to delete blog');
        }
    };

    return (
        <div className="min-h-screen bg-blue-200 pt-20 px-6">
            <div className="max-w-3xl mx-auto">

                {/* Cover Image */}
                <div
                    className="relative w-full mb-6 cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                >
                    <img
                        src={croppedBlob ? URL.createObjectURL(croppedBlob) : `${import.meta.env.VITE_BASE_URL}/coverPictures/${existingCoverPic}`}
                        alt="Cover"
                        className="mx-auto max-h-[300px] object-contain border-2 border-black"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center text-white text-lg opacity-0 hover:opacity-100 transition">
                        Click to change cover image
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                </div>

                {/* Title Input */}
                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-1 text-black">Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border border-black rounded"
                        placeholder="Blog Title"
                    />
                </div>

                {/* Content Input */}
                <div className="mb-6">
                    <label className="block text-lg font-semibold mb-1 text-black">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border border-black rounded min-h-[200px]"
                        placeholder="Blog Content"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex w-full justify-between mt-6">
                    {/* Delete */}
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                        Delete Blog
                    </button>
                    {/* Save + Cancel */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate(`/blog/${id}`)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                    </div>

                </div>

            </div>

            {cropModalOpen && tempImage && (
                <CropModal
                    imageSrc={tempImage}
                    aspectRatio={4 / 1}
                    onClose={() => setCropModalOpen(false)}
                    onCropComplete={(blob) => {
                        setCroppedBlob(blob);
                    }}
                />
            )}
        </div>
    );
};

export default EditBlog;
