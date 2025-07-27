import { useContext, useEffect, useRef, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import CropModal from '../components/CropModal';

const Profile = () => {
    const { user, setuser } = useContext(userDataContext);
    const [newPic, setNewPic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [croppedBlob, setCroppedBlob] = useState(null);
    const [tempImage, setTempImage] = useState(null);
    const fileInputRef = useRef(null)
    const [blogs, setblogs] = useState([])

    const navigate = useNavigate()

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImage(reader.result);
                setCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };


    const fetchBlogs = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/blog/by-author/${user.userName}`);
        return res.data;
    };

    useEffect(() => {
        setLoading(true);
        fetchBlogs().then((newBlogs) => {
            if (newBlogs.length === 0) {
                return;
            }
            setblogs(prev => {
                const combined = [...prev, ...newBlogs];
                const unique = Array.from(new Map(combined.map(b => [b._id, b])).values());
                return unique;
            });
            setLoading(false);
        });
    }, [user]);


    const resetPassword = async () => {
        const userData = {
            email: user.email
        }

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/forgot-paasword-otp`, userData)
        if (response.status === 200) {
            navigate('/reset-password')
        }
    }

    const logout = async () => {
        if (!confirm('Are you sure you want to logout?')) return;
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            await setuser({
                userName: '',
                email: ''
            })
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Failed to logout');
        }
    }


    const uploadNewPic = async () => {
        if (!profilePicFile) return;
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('profilePic', profilePicFile);

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
                setProfilePicFile(null)
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
        <div className='min-h-screen bg-gray-700 flex flex-col items-center px-4 pt-32'>
            {/* Top Heading */}
            <div className="w-full bg-green-900 text-3xl fixed top-0 z-50 rounded-b-2xl  flex items-center justify-center py-4 min-h-[64px]">
                {/* Home Icon on Left */}
                <Link
                    to="/"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl"
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
                <div className='flex flex-col md:flex-row w-full justify-between items-center gap-6 '>

                    {/* Profile Photo */}
                    <div className='flex flex-col items-center gap-3'>
                        <div
                            className="w-32 h-32 rounded-full overflow-hidden border-2 shadow-md cursor-pointer"
                            onClick={() => fileInputRef.current.click()}
                        >
                            {user.profilePic || croppedBlob ? (
                                <img
                                    src={
                                        croppedBlob
                                            ? URL.createObjectURL(croppedBlob)
                                            : `${import.meta.env.VITE_BASE_URL}/profilePictures/${user.profilePic}`
                                    }
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    style={{ aspectRatio: "1 / 1" }}
                                />
                            ) : (
                                <div className="text-white text-sm text-center">No Image</div>
                            )}
                        </div>


                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            hidden
                            onChange={handleProfilePicChange}
                            className="text-sm"
                        />
                        {profilePicFile && (
                            <>
                                <button
                                    onClick={uploadNewPic}
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-md transition disabled:opacity-50"
                                >
                                    {loading ? 'Uploading...' : 'Upload Photo'}
                                </button>
                            </>
                        )}
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

                {/* Change username */}
                <Link
                    to={'/change-username'}
                    className='bg-gray-400 px-6 py-3 border border-black text-center w-full rounded hover:bg-gray-500 transition'>
                    Change Username
                </Link>

                {/* Reset Password */}
                <button
                    onClick={resetPassword}
                    className='bg-gray-400 px-6 py-3 border border-black text-center w-full rounded hover:bg-gray-500 transition'>
                    RESET PASSWORD
                </button>

                {/* Logout */}
                <button
                    onClick={logout}
                    className='bg-gray-400 px-6 py-3 border border-black text-center w-full rounded hover:bg-gray-500 transition'>
                    Logout
                </button>
            </div>

            {cropModalOpen && tempImage && (
                <CropModal
                    imageSrc={tempImage}
                    aspectRatio={1} // 👈 1:1 for profile
                    onClose={() => setCropModalOpen(false)}
                    onCropComplete={(blob) => {
                        const file = new File([blob], 'profile-pic.png', { type: blob.type });
                        setCroppedBlob(blob);       // for preview (optional)
                        setProfilePicFile(file);    // for upload
                    }}
                />
            )}

            <h2 className='mt-10 text-3xl text-black font-medium text-center'>Blogs by User</h2>

            {/* blogs by user */}
            <div className=' w-full justify-center flex'>
                <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8 px-4">
                    {blogs.map((blog) => (
                        <Link
                            to={`/blog/${blog._id}`}
                            key={blog._id} className="bg-gray-100 rounded shadow p-2">
                            <img
                                src={`${import.meta.env.VITE_BASE_URL}/coverPictures/${blog.coverPic}`}
                                alt="Cover"
                                className="w-full h-32 object-cover rounded"
                            />
                            <h3 className="font-bold mt-2 text-black">{blog.title}</h3>
                            <p className="text-sm text-gray-600">{blog.content.split(" ").slice(0, 40).join(" ")}......................</p>
                        </Link>
                    ))}
                </div>
                <div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
