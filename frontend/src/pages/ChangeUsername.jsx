import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangeuserName = () => {
    const [error, setError] = useState(' ');
    const { user, setuser } = useContext(userDataContext);
    const [userName, setuserName] = useState('')
    const [otp, setOtp] = useState('')
    const [availiable, setavailiable] = useState(null)
    const [otpBox, setotpBox] = useState(false)
    const [otpSent, setOtpSent] = useState(false);


    const navigate = useNavigate()

    const handleOtpRequest = async () => {
        if (!userName || !availiable) return;

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/username-otp`, {
                email: user.email,
                userName
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.status === 200) {
                setotpBox(true);
                setOtpSent(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const handleChangeUsername = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/update-username`, {
                email: user.email,
                userName,
                otp
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.status === 200) {
                setuser(response.data.user);
                navigate('/profile');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const checkAvailiblity = async (Name) => {
        const data = { userName: Name };
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/checkUsername`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.status === 200) {
                setavailiable(true);
            }
        } catch (err) {
            setavailiable(false);
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className='flex items-center justify-center h-screen w-screen bg-gray-700'>
            <div className='h-1/18 pt-1 bg-green-900 w-full rounded-b-2xl text-3xl top-0 text-center fixed '>Mavi Jr Blogs </div>
            <div className="w-96  bg-gray-400 rounded-xl shadow-lg flex-col flex p-8 items-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Change userName</h2>
                <form onSubmit={otpSent ? handleChangeUsername : (e) => { e.preventDefault(); handleOtpRequest(); }} className='w-full flex flex-col gap-4'>
                    <div className="relative w-full">
                        <input
                            value={userName}
                            onChange={(e) => {
                                setError('');
                                setuserName(e.target.value);
                                checkAvailiblity(e.target.value);
                            }}
                            required
                            placeholder='New username'
                            className='w-full py-2 px-4 border-2 border-black rounded-md focus:outline-none focus:ring-1 focus:ring-black'
                        />
                        {userName !== '' && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl">
                                {availiable ? '✅' : '❌'}
                            </span>
                        )}
                    </div>

                    {otpBox && (
                        <input
                            value={otp}
                            onChange={(e) => {
                                setError('');
                                setOtp(e.target.value);
                            }}
                            required
                            placeholder='Enter OTP'
                            className='w-full py-2 px-4 border-2 border-black rounded-md focus:outline-none focus:ring-1 focus:ring-black'
                        />
                    )}

                    {error && <div className="text-red-600 text-sm mt-1">{error}</div>}

                    <button type="submit" className='w-full py-2 px-4 border-2 border-black rounded-md focus:outline-none focus:ring-1 focus:ring-black text-lg font-medium'>
                        {otpSent ? 'Change Username' : 'Send OTP'}
                    </button>
                </form>

            </div>
        </div>
    )
}
export default ChangeuserName