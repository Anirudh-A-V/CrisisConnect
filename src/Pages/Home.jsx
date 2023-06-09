import Header from '../Assets/header.png'
import About from '../Assets/about.jpg'
import Contact from '../Assets/contact.png'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

const Home = () => {
    return (
        <div>
            <Navbar />
            <section className='white max-sm:h-full h-screen overflow-hidden'>
                <div className='flex max-sm:flex-col mt-4 max-sm:justify-start justify-center items-center h-full'>
                    <div className='flex flex-col max-sm:w-full max-sm:items-center max-sm:h-auto justify-start items-start h-full w-1/2'>
                        <h1 className='text-7xl max-sm:text-5xl mt-36 max-sm:mx-4 max-sm:mt-24 ml-10 font-bold text-center text-gray-800'>
                            <span className='text-gray-600'>Crisis</span>
                            <span className='text-gray-500'>Connect</span>
                        </h1>
                        <p className='text-justify ml-10 mt-4 max-sm:mx-4 text-gray-700'>Crisis connect is an online medical emergency  information resource for people in an emergency situation. Anyone from anywhere can connect to nearby hospitals with maximum facilities for their emergency medical condition.</p>
                        <div className='flex flex-col justify-center items-center max-sm:mx-4 mt-4 ml-10'>
                            <div className='flex flex-row justify-start items-start max-sm:mx-4 '>
                                <button className='bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-3xl max-sm:mx-0 mt-4 mx-5'>
                                    <a href='/emergency'>Emergency</a>
                                </button>
                                <button className='bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-3xl mt-4 mx-5'>
                                    <a href='/search'>Search</a>
                                </button>
                            </div>
                            <button className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl mt-4 m-auto'>
                                <a href='/map'>Hospitals Near Me</a>
                            </button>
                        </div>

                    </div>
                    <div className='flex flex-col justify-center max-sm:h-auto max-sm:w-[95vw] items-center h-1/2 w-1/2'>
                        <img src={Header} alt='hospital' className='max-sm:h-auto max-sm:mt-6 h-full w-full object-cover' />
                        {/* <p className='text-center mt-4'>Click the button below to get started</p>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
                            <a href='/map'>Get Started</a>
                        </button> */}
                    </div>
                </div>
            </section>
            <section className='About bg-gray-50 max-sm:h-full h-screen overflow-hidden' id='About'>
                <div className='flex flex-row max-sm:flex-col-reverse max-sm:justify-end justify-center items-center h-full'>
                    <div className='flex flex-col justify-center max-sm:h-auto max-sm:w-[95vw] items-center h-1/2 w-1/2'>
                        <img src={About} alt='hospital' className='max-sm:h-auto max-sm:mt-6 h-full w-full object-cover' />
                        {/* <p className='text-center mt-4'>Click the button below to get started</p>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
                            <a href='/map'>Get Started</a>
                        </button> */}
                    </div>
                    <div className='flex flex-col max-sm:w-full max-sm:items-center max-sm:h-auto justify-start items-start h-full w-1/2'>
                        <h2 className='text-6xl max-sm:text-5xl mt-36 max-sm:mx-4 max-sm:mt-24 ml-10 font-bold  text-center text-gray-800'>
                            <span className='text-gray-600'>About</span>
                            <span className='text-gray-500'>Us</span>
                        </h2>
                        <div className="max-sm:w-full w-3/4">
                            <p className='text-justify ml-10 mt-4 max-sm:mx-4 text-gray-700'>At Crisis Connect, we understand the urgency and stress that comes with medical emergencies. Our goal is to bridge the gap between individuals in need and the medical facilities that can provide timely and life-saving treatments. We strive to empower people with the information they need to make informed decisions during critical times.</p>
                            <p className='text-justify ml-10 mt-4 max-sm:mx-4 text-gray-700'>Our platform aggregates data from trusted sources and partners with hospitals and medical institutions to provide up-to-date information on their services, specialties, and availability. Through our user-friendly interface, individuals can easily search for nearby hospitals based on their emergency medical condition, location, and desired facilities. We aim to provide a seamless experience that minimizes response time and maximizes access to quality healthcare.</p>
                        </div>
                        {/* <div className='flex flex-row justify-start items-start max-sm:mx-4 mt-4 ml-10'>
                            <button className='bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-3xl mt-4 max-sm:mx-0 ml-10'>
                                <a href='/map'>Emergency</a>
                            </button>
                            <button className='bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-3xl mt-4 ml-10'>
                                <a href='/search'>Search</a>
                            </button>
                        </div> */}
                    </div>
                </div>
            </section>
            <section className='Contact bg-gray-50 max-sm:h-full h-screen overflow-hidden' id='Contact'>
                <div className='flex flex-row max-sm:flex-col max-sm:justify-start justify-center items-center mb-14 h-full'>
                    <div className='flex flex-col max-sm:w-full max-sm:items-center max-sm:h-auto justify-start items-start h-full w-1/2'>
                        <h2 className='text-6xl max-sm:text-5xl mt-36 max-sm:mx-4 max-sm:mt-24 ml-10 font-bold  text-center text-gray-800'>
                            <span className='text-gray-600'>Contact</span>
                            <span className='text-gray-500'>Us</span>
                        </h2>
                        <div className="max-sm:w-full w-3/4">
                            <p className='text-justify ml-10 mt-4 max-sm:mx-4 text-gray-700'>We value your feedback, questions, and concerns. If you have any inquiries or would like to get in touch with us, please feel free to reach out through the following channels. Our dedicated support team is available to assist you during business hours and will respond to your inquiries as soon as possible.</p>
                        </div>
                        <div className='flex flex-row justify-center items-center max-sm:mx-4 mt-4 ml-10'>
                            {/* <button className='bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-3xl mt-4 max-sm:mx-0 ml-10'>
                                <a href='/map'>Emergency</a>
                            </button> */}
                            <button className='bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-sm mt-4 sm:ml-10'>
                                <a href='/search'>Connect with us</a>
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center max-sm:h-auto max-sm:mt-10 max-sm:w-[95vw] items-center h-1/2 w-1/2'>
                        <img src={Contact} alt='hospital' className='max-sm:h-auto max-sm:mt-6 h-full w-full object-cover' />
                        {/* <p className='text-center mt-4'>Click the button below to get started</p>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
                            <a href='/map'>Get Started</a>
                        </button> */}
                    </div>

                </div>
            </section>
            <Footer />
        </div>
    )
}

export default Home