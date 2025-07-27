import React, { useContext, useEffect, useState } from 'react'
import { userDataContext } from '../context/UserContext';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const ShowBlog = () => {
    const token = localStorage.getItem('token')
    const { id } = useParams();
    const { user, setuser } = useContext(userDataContext);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [blog, setBlog] = useState(null);
    const [imgSrc, setImgSrc] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setuser(response.data)
            }
        })
    }, [token])


    const preloadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(setImgSrc(img.src));
            img.onerror = () => reject();
        });
    };

    const like = async () => {
        const alreadyLiked = blog.likes.includes(user._id);

        // Optimistically update
        setBlog(prev => ({
            ...prev,
            likes: alreadyLiked
                ? prev.likes.filter(id => id !== user._id)
                : [...prev.likes, user._id]
        }));

        try {
            await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/blog/like/${blog._id}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
        } catch (err) {
            console.error("Failed to update like:", err);
            // Rollback if request fails
            setBlog(prev => ({
                ...prev,
                likes: alreadyLiked
                    ? [...prev.likes, user._id] // rollback to liked
                    : prev.likes.filter(id => id !== user._id) // rollback to unliked
            }));
        }
    };

    useEffect(() => {
        if (user?.profilePic) {
            const profileUrl = `${import.meta.env.VITE_BASE_URL}/profilePictures/${user.profilePic}`;
            preloadImage(profileUrl)
                .then(() => setImageLoaded(true))
                .catch(() => setImageLoaded(true)); // fallback if image fails to load
        } else {
            setImageLoaded(true); // no pic? skip
        }
    }, [user]);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_BASE_URL}/blog/${id}`)
            .then((res) => setBlog(res.data))
            .catch((err) => {
                console.error('Error loading blog:', err);
            });
    }, [id]);

    if (!blog || !imageLoaded) return <div className="text-white p-6">Loading blog...</div>;

    const isLiked = blog.likes.includes(user._id);
    return (
        <div className='min-h-screen bg-blue-200'>
            <div className="fixed top-0 w-full z-50">
                {/* Green Header */}
                <div className="bg-green-700 w-full py-3 rounded-b-2xl text-black text-2xl flex items-center justify-center relative ">
                    <Link
                        to="/"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl"
                    >
                        <i className="ri-home-line"></i>
                    </Link>
                    Mavi Jr Blogs
                    {user?.email ? (
                        <Link to="/profile" className="absolute right-4 top-1/2 -translate-y-1/2">
                            <img
                                className="bg-red-500 rounded-full w-8 h-8 object-cover border"
                                src={imgSrc}
                                alt=""
                            />
                        </Link>
                    ) : (
                        <Link to={'/login'}>
                            <i className="hover:border-2 absolute rounded-lg right-4 top-1/2 -translate-y-1/2 ri-login-box-line"> login </i>
                        </Link>
                    )}
                    
                </div>


            </div>
            <div className='pt-13 px-20'>
                <div className="relative w-full mx-auto bg-blue-200  p-6 border border-blue-200">
                    {blog.coverPic !== '' && (<>
                        <img className="mx-auto max-h-100 object-contain mb-4"
                            src={`${import.meta.env.VITE_BASE_URL}/coverPictures/${blog.coverPic}`} alt="" />
                    </>)}


                    <div className='flex flex-row'>
                        {/* Title */}
                        <h1 className="text-3xl font-bold mb-2 text-center">{blog.title}</h1>
                    </div>

                    {/* Content */}
                    <div className="text-lg leading-relaxed whitespace-pre-line">
                        {blog.content}
                    </div>
                    <hr />
                    <div>
                        <button
                            onClick={like}
                            className='py-2'
                        >
                            {isLiked ? <i className="ri-heart-fill text-red-500"></i> : <i className="ri-heart-line text-white"></i>}
                            <span>  {blog.likes.length} likes</span>
                        </button>

                        {/* Author Row */}

                        {user?._id === blog.author._id ? (
                            <Link to={`/blog/edit/${id}`}
                                className="absolute  right-7 w-10 rounded-full hover:border-2 lex items-center justify-center  gap-2 mb-6 text-m text-black">
                                <span><i classname="ri-pencil-line"></i>Edit</span>
                            </Link>
                        ) : (
                            <Link to={`/user/${blog.author.userName}`}
                                className="absolute  right-7 rounded-full hover:border-2 lex items-center justify-center  gap-2 mb-6 text-m  text-black">
                                Author:
                                <span> {blog.author.userName}</span>
                            </Link>)}


                    </div>
                </div>
            </div>

        </div>

    )
}

export default ShowBlog