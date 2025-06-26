import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [userId, setuserId] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const submitHandler = async (e) => {
        e.preventDefault();
        const userData = {
            email:userId,
            password:password
        }

        const response = await axios.post('http://localhost:4000/user/login',userData)
        if (response.status === 200) {
            localStorage.setItem('token',response.data.token)
            navigate('/');
        }

        setuserId('')
        setPassword('')
    }

    return (
        <div className='flex items-center justify-center h-screen w-screen bg-gray-700'>
            <div className='h-1/18 pt-1 bg-green-900 w-full rounded-b-2xl text-3xl top-0 text-center fixed '>Mavi Jr Blogs </div>
            <div className="w-96  bg-gray-400 rounded-xl shadow-lg flex-col flex p-8 items-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
                <form
                    onSubmit={(e) => {
                        submitHandler(e)
                    }}
                    className='w-full flex flex-col gap-4' action="">
                    <input
                        value={userId}
                        onChange={(e) => {
                            setuserId(e.target.value)
                        }}
                        required
                        placeholder='Email'
                        className='w-full py-2 px-4 border-2 border-black rounded-md focus:outline-none focus:ring-1 focus:ring-black'
                    />

                    <input
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        required
                        placeholder='Password'
                        type='password'
                        className='w-full py-2 px-4 border-2 border-black rounded-md focus:outline-none focus:ring-1 focus:ring-black'
                    />

                    <button
                        className='w-full py-2 px-4 border-2 border-black rounded-md focus:outline-none focus:ring-1 focus:ring-black text-lg font-medium'>Login</button>
                </form>
                <p>Don't have an account ?? <a href='/signup'>Sign up</a> </p>
            </div>
        </div>
    )
}

export default Login