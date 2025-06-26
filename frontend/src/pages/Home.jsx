import React from 'react'

const Home = () => {
    return (

        <div className='h-screen bg-gray-700'>
            <div className='h-1/10 pt-10  bg-blue-600 flex items-center flex-col justify-center 
            rounded-b-2xl text-3xl top-10 text-center '>

                <div className='h-1/20 pt-1 bg-green-900 w-full py-0 items-center 
                 flex-col rounded-b-2xl text-3xl top-0 text-center fixed z-50'>Mavi Jr Blogs </div>
                <div>Home, theory</div>

            </div>
            <div className='flex flex-row'>
                <div className='h-screen w-1/2 justify-center flex bg-red-700'>hello </div>
                <div className='h-screen w-1/2 justify-center flex bg-yellow-500'> world </div>
            </div>
        </div>

    )
}

export default Home