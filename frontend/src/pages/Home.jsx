import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { userDataContext } from '../context/UserContext';
import { useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const token = localStorage.getItem('token')
    const { user, setuser } = useContext(userDataContext);
    const [activeTab, setactiveTab] = useState('home');
    const [page, setPage] = useState(1);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [imgSrc, setImgSrc] = useState(user?.profilePic || null);
    const [loggedin, setloggedin] = useState(false)

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setuser(response.data)
                setloggedin(true)
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

    useEffect(() => {
        if (user?.profilePic) {
            setImgSrc(user.profilePic); // use Cloudinary image URL
        }
    }, [user]);



    const fetchBlogs = async (type, page) => {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/blog/${type}?page=${page}&limit=10`);
        return res.data;
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading && hasMore) {
                setLoading(true);
                fetchBlogs(activeTab, page).then((newBlogs) => {
                    if (newBlogs.length === 0) {
                        setHasMore(false)
                        return; // no more to load
                    }
                    setBlogs(prev => {
                        const combined = [...prev, ...newBlogs];
                        const unique = Array.from(new Map(combined.map(b => [b._id, b])).values());
                        return unique;
                    });
                    setPage(prev => prev + 1);
                    setLoading(false);
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [page, loading, activeTab]);

    useEffect(() => {
        setBlogs([]);
        setPage(1);
        setLoading(true);
        fetchBlogs(activeTab, 1).then((newBlogs) => {
            setBlogs(newBlogs);
            setLoading(false);
        });
    }, [activeTab]);

    return (

        <div className='min-h-full overflow-x-hidden bg-gray-700'>
            <div className="fixed top-0 w-full z-50">
                {/* Green Header */}
                <div className="bg-green-900 w-full py-3 text-black text-2xl flex items-center justify-center relative ">
                    Mavi Jr Blogs
                    {loggedin? (
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

                {/* Blue Navigation Bar */}
                <div className="bg-blue-600 w-full py-3 flex pl-5 gap-6 text-balck text-lg rounded-b-2xl">
                    <button
                        className={`hover:text-white hover:underline transition ${activeTab === 'home' ? 'font-semibold underline' : ''}`}
                        onClick={() => setactiveTab('home')}>Home</button>
                    <button
                        className={`hover:text-white hover:underline transition ${activeTab === 'most-liked' ? 'font-semibold underline' : ''}`}
                        onClick={() => setactiveTab('most-liked')}>Most liked</button>
                    <button
                        className={`hover:text-white hover:underline transition ${activeTab === 'latest' ? 'font-semibold underline' : ''}`}
                        onClick={() => setactiveTab('latest')}>Latest</button>
                    <Link
                        to={'/blog/create-blog'}
                        className={`hover:border-2 transition absolute right-5`}>+ Create a blog</Link>
                </div>
            </div>

            {/* For You*/}
            {activeTab === 'home' && (<>
                <div className='min-h-screen w-full justify-center flex'>
                    <div className="mt-30 w-full  mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-5 px-10">
                        {blogs.map((blog) => (
                            <Link
                                to={`/blog/${blog._id}`}
                                key={blog._id} className="bg-gray-100 rounded shadow p-2">
                                <img
                                    src={blog.coverPic}
                                    alt="Cover"
                                    className="w-full h-32 object-cover rounded"
                                />
                                <h3 className="font-bold mt-2 text-black">{blog.title}</h3>
                                <p className="text-sm text-gray-600">{blog.content.split(" ").slice(0, 50).join(" ")}......................</p>
                            </Link>
                        ))}
                    </div>

                </div>
            </>)}

            {/* Most most-liked tab */}
            {activeTab === 'most-liked' && (<>
                <div className='min-h-screen w-full justify-center flex'>
                    <div className="mt-30 w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-5 px-10">
                        {blogs.map((blog) => (
                            <Link
                                to={`/blog/${blog._id}`}
                                key={blog._id} className="bg-gray-100 rounded shadow p-2">
                                <img
                                    src={blog.coverPic}
                                    alt="Cover"
                                    className="w-full h-32 object-cover rounded"
                                />
                                <h3 className="font-bold mt-2 text-black">{blog.title}</h3>
                                <p className="text-sm text-gray-600">{blog.content.split(" ").slice(0, 50).join(" ")}......................</p>
                            </Link>
                        ))}
                    </div>

                </div>
            </>)}

            {/* Latest Tab */}
            {activeTab === 'latest' && (<>
                <div className='min-h-screen w-full justify-center flex'>
                    <div className="mt-30 w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-5 px-10">
                        {blogs.map((blog) => (
                            <Link
                                to={`/blog/${blog._id}`}
                                key={blog._id} className="bg-gray-100 rounded shadow p-2">
                                <img
                                    src={blog.coverPic}
                                    alt="Cover"
                                    className="w-full h-32 object-cover rounded"
                                />
                                <h3 className="font-bold mt-2 text-black">{blog.title}</h3>
                                <p className="text-sm text-gray-600">{blog.content.split(" ").slice(0, 50).join(" ")}......................</p>
                            </Link>
                        ))}
                    </div>

                </div>
            </>)}

            {/* End of page */}
            {!hasMore && (
                <div className="text-center mt-5 text-black py-4">
                    🎉 You’ve reached the end!
                </div>
            )}
        </div>

    )
}

export default Home