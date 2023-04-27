import React from 'react'

const Navbar = () => {
    return (
        <nav className='flex justify-end items-center h-16 bg-white relative font-mono mt-4k' role='navigation'>
            <ul className="inline-block list-none p-0">
                <li className="inline-block mr-2">
                    <a href="/" className="text-gray-600 text-lg hover:text-gray-900 font-bold py-2 px-4 rounded inline-flex items-center hover:bg-slate-100 transition-all duration-100 ease-in-out">
                        <span>Home</span>
                    </a>
                </li>
                <li className="inline-block mr-2">
                    <a href="#about" className="text-gray-600 text-lg hover:text-gray-900 font-bold py-2 px-4 rounded inline-flex items-center hover:bg-slate-100 transition-all duration-100 ease-in-out">
                        <span>About</span>
                    </a>
                </li>
                <li className="inline-block mr-2">
                    <a href="#contact" className="text-gray-600 text-lg hover:text-gray-900 font-bold py-2 px-4 rounded inline-flex items-center hover:bg-slate-100 transition-all duration-100 ease-in-out">
                        <span>Contact</span>
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar