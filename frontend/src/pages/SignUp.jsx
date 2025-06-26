import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
    const [userId, setuserId] = useState('')
    const [Username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [showAdditionalFields, setShowAdditionalFields] = useState(false)

    const navigate = useNavigate()
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!showAdditionalFields) {
            const userData = {
                email: userId,
                userName: Username
            }

            const response = await axios.post('http://localhost:4000/user/signup', userData)
            if (response.status === 200) {
                setShowAdditionalFields(true)
            }
        } else {
            const userData = {
                email: userId,
                userName: Username,
                password: password,
                otp: otp
            }

            const response = await axios.post('http://localhost:4000/user/register', userData)
            if (response.status === 200) {
                navigate('/')
            }
        }
    }

    return (
        <div className='flex items-center justify-center h-screen w-screen bg-gray-700'>
            <div className='h-1/18 pt-1 bg-green-900 w-full rounded-b-2xl text-3xl top-0 text-center fixed '>Mavi Jr Blogs </div>
            <div className="w-96  bg-gray-400 rounded-xl shadow-lg flex-col flex p-8 items-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h2>
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

                    <input
                        disabled={showAdditionalFields}
                        value={Username}
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                        required
                        placeholder='Username'
                        type='Username'
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
                                placeholder='password'
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
                        className='w-full py-2 px-4 border-2 border-black rounded-md focus:outline-none focus:ring-1 focus:ring-black text-lg font-medium'>Sign up</button>
                </form>
                <p>Already have an account ?? <a href='/login'>Log in</a> </p>
            </div>
        </div>
    )
}

export default SignUp