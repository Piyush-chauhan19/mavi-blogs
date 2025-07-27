import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';

const User = () => {
  const { user, setuser } = useContext(userDataContext);

  const { username } = useParams(); // 👈 gets from URL
  const [User, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blogs, setblogs] = useState([])

  const fetchBlogs = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/blog/by-author/${username}`);
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



  // Fetch user by username
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/user/public/${username}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [username]);

  if (loading || !user) return <div className="text-white p-6">Loading profile...</div>;

  return (
    <div className='min-h-screen bg-gray-700 flex flex-col items-center px-4 pt-32'>
      {/* Top Heading */}
      <div className="w-full bg-green-900 text-black text-3xl fixed top-0 z-50 rounded-b-2xl flex items-center justify-center py-4 min-h-[64px]">
        <Link
          to="/"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl"
        >
          <i className="ri-home-line"></i>
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2">
          Mavi Jr Blogs
        </div>
        <Link to="/profile" className="absolute right-4 top-1/2 -translate-y-1/2">
          <img
            className="bg-red-500 rounded-full w-8 h-8 object-cover border"
            src={`${import.meta.env.VITE_BASE_URL}/profilePictures/${user.profilePic}`}
            alt=""
          />
        </Link>
      </div>

      <div>
        {/* Main Box */}
        <div className="w-full max-w-2xl bg-gray-600 rounded-xl shadow-lg flex flex-col p-6 items-center gap-6 border border-black">
          {/* User + Info Row */}
          <div className='flex flex-col md:flex-row w-full justify-between items-center gap-6'>

            {/* Profile Photo */}
            <div className='flex flex-col items-center gap-3'>
              <div
                className="w-32 h-32 rounded-full overflow-hidden border-2 shadow-md"
              >
                {User?.profilePic ? (
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/profilePictures/${User.profilePic}`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full text-white flex items-center justify-center bg-black text-center text-sm">
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* Username & Email */}
            <div className='flex flex-col gap-4 w-full'>
              <div className='px-4 py-2 border border-black font-medium bg-gray-400 rounded'>
                <h2 className='font-light text-sm'>User Name</h2>
                <div>{User.userName}</div>
              </div>
            </div>
          </div>
        </div>

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
                <p className="text-sm text-gray-600">{blog.content.split(" ").slice(0, 50).join(" ")}......................</p>
              </Link>
            ))}
          </div>
          <div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
