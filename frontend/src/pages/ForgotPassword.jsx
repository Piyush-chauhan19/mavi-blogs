import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
   const [userId, setuserId] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [showAdditionalFields, setShowAdditionalFields] = useState(false)

    const navigate = useNavigate()
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!showAdditionalFields) {
            const userData = {
                email: userId,
            }

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/forgot-paasword-otp`, userData)
            if (response.status === 200) {
                setShowAdditionalFields(true)
            }
        } else {
            const userData = {
                email: userId,
                password: password,
                otp: otp
            }

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/new-paasword`, userData)
            if (response.status === 200) {
                navigate('/')
            }
        }
    }

    return (
        <div className='flex items-center justify-center h-screen w-screen bg-gray-700'>
            <div className='h-1/18 pt-1 bg-green-900 w-full rounded-b-2xl text-3xl top-0 text-center fixed '>Mavi Jr Blogs </div>
            <div className="w-96  bg-gray-400 rounded-xl shadow-lg flex-col flex p-8 items-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Forgot Password</h2>
                <form
                    onSubmit={(e) => {
                        submitHandler(e)
                    }}
                    className='w-full flex flex-col gap-4' action="">
                    <input
                        disabled={showAdditionalFields}
                        value={userId}
                        onChange={(e) => {
                            setuserId(e.target.value)
                        }}
                        required
                        placeholder='Email'
                        className='w-full py-2 px-4 border-2 border-black rounded-md focus:outline-none focus:ring-1 focus:ring-black'
                    />
                    {showAdditionalFields && (
                        <>
                            <input
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                                required
                                placeholder='New password'
                                type='password'
                                className='w-full py-2 px-4 border-2 border-black rounded-md focus:outline-none focus:ring-1 focus:ring-black'
                            />

                            <input
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e.target.value)
                                }}
                                required
                                placeholder='otp'
                                className='w-full py-2 px-4 border-2 border-black rounded-md focus:outline-none focus:ring-1 focus:ring-black'
                            />
                        </>
                    )}

                    <button
                        className='w-full py-2 px-4 border-2 border-black rounded-md focus:outline-none focus:ring-1 focus:ring-black text-lg font-medium'>{showAdditionalFields? "Reset Password" : "Send otp"}</button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword