import React from 'react'
import Navbar from '../Components/Navbar'

const Search = () => {
    return (
        <div>
            <Navbar />
            <section className='white h-screen w-full'>
                <div className='flex flex-col justify-start mt-10 items-center h-full w-full'>
                    <h1 className='text-7xl mt-20 ml-10 font-bold text-center text-gray-800'>
                        <span className='text-gray-600'>Search</span>
                        <span className='text-gray-500'> Emergencies</span>
                    </h1>
                    <input type="text" placeholder="Search" className="w-1/2 h-12 mt-4 border-2 border-gray-300 rounded-lg px-4 focus:outline-none focus:border-blue-500" />
                    <button className='bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-3xl mt-4 ml-10'>
                        <a href='/'>Search</a>
                    </button>
                </div>
            </section>


        </div>
    )
}

export default Search