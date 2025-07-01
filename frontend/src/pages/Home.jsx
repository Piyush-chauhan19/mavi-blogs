import React, { useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { userDataContext } from '../context/UserContext';

const Home = () => {
    const { user, setuser } = useContext(userDataContext);
    const home = useRef(true)
    const theory = useRef(false)
    const [activeTab, setactiveTab] = useState('home')

    return (

        <div className='h-screen bg-gray-700'>
            <div className="fixed top-0 w-full z-50">
                {/* Green Header */}
                <div className="bg-green-900 w-full py-3 text-black text-2xl flex items-center justify-center relative ">
                    Mavi Jr Blogs
                    <Link to="/profile" className="absolute right-4 top-1/2 -translate-y-1/2">
                        <img
                            className="bg-red-500 rounded-full w-8 h-8 object-cover border"
                            src={`${import.meta.env.VITE_BASE_URL}/profilePictures/${user.profilePic}`}
                            alt=""
                        />
                    </Link>
                </div>

                {/* Blue Navigation Bar */}
                <div className="bg-blue-600 w-full py-3 flex pl-5 gap-6 text-balck text-lg rounded-b-2xl">
                    <button onClick={() => setactiveTab('home')}>Home</button>
                    <button onClick={() => setactiveTab('theory')}>Theory</button>
                </div>
            </div>

            {activeTab === 'home' && (<>
                <div className='flex flex-row'>
                    <div className='h-screen w-1/2 justify-center flex bg-red-700'>hello </div>
                    <div className='h-screen w-1/2 justify-center flex bg-yellow-500'> world </div>
                </div>
            </>)}
        </div>

    )
}

export default Home