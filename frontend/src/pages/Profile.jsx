import { useContext, useRef, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, setuser } = useContext(userDataContext);
    const [newPic, setNewPic] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null)
    console.log(user)

    const uploadNewPic = async () => {
        if (!newPic) return;
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('profilePic', newPic);

            const response = await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/user/profile-pic`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.status === 200) {
                setuser(response.data.user); // Update user in context
                alert('Profile picture updated!');
            }
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-700 px-4'>
            {/* Top Heading */}
            <div className="w-full bg-green-900 text-white text-3xl fixed top-0 z-50 rounded-b-2xl  flex items-center justify-center py-4 min-h-[64px]">
                {/* Home Icon on Left */}
                <Link
                    to="/"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl"
                >
                    <i className="ri-home-line"></i>
                </Link>

                {/* Title Centered */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    Mavi Jr Blogs
                </div>
            </div>

            {/* Main Box */}
            <div className="w-full max-w-2xl mt-28 bg-gray-600 rounded-xl shadow-lg flex flex-col p-6 items-center gap-6 border border-black">

                {/* Profile + Info Row */}
                <div className='flex flex-col md:flex-row w-full justify-between items-center gap-6'>

                    {/* Profile Photo */}
                    <div className='flex flex-col items-center gap-3'>
                        {user.profilePic ? (
                            <img
                                src={`${import.meta.env.VITE_BASE_URL}/profilePictures/${user.profilePic}`}
                                alt="Profile"
                                className='w-32 h-32 rounded-full border border-black object-cover'
                                onClick={() => fileInputRef.current.click()}
                                
                            />
                        ) : (
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className='w-32 h-32 text-white flex items-center justify-center bg-black rounded-full border border-black text-center text-sm'>
                                No Image
                            </div>
                            
                        )}
                        
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            hidden
                            onChange={(e) => setNewPic(e.target.files[0])}
                            className="text-sm"
                        />
                        <button
                            onClick={uploadNewPic}
                            disabled={loading}
                            className="px-4 py-2 bg-gray-400 text-white rounded border border-black hover:bg-gray-500 transition disabled:opacity-50"
                        >
                            {loading ? 'Uploading...' : 'Upload Photo'}
                        </button>
                    </div>

                    {/* Username & Email */}
                    <div className='flex flex-col gap-4 w-full'>
                        <div className='px-4 py-2 border border-black font-medium bg-gray-400 rounded'>
                            <h2 className='font-light text-sm '>User Name</h2>
                            <div>{user.userName}</div>
                        </div>

                        <div className='px-4 py-2 border border-black font-medium bg-gray-400 rounded'>
                            <h2 className='font-light text-sm '>Email</h2>
                            <div>{user.email}</div>
                        </div>
                    </div>
                </div>

                {/* Reset Password */}
                <button className='bg-gray-400 px-6 py-3 border border-black text-center w-full rounded hover:bg-gray-500 transition'>
                    RESET PASSWORD
                </button>
            </div>
        </div>
    );
};

export default Profile;
