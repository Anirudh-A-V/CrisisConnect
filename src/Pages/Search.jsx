import { useState, useEffect } from 'react'
import Navbar from '../Components/Navbar'
import * as turf from '@turf/turf';
import { Link, useNavigate } from 'react-router-dom';

import Location from '../Data/location.js'
import Query from '../Data/query'

const Search = () => {
    const [search, setSearch] = useState('')
    const [services, setServices] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [longitude, setLongitude] = useState(0)
    const [latitude, setLatitude] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {

        const success = (position) => {
            setLongitude(position.coords.longitude)
            setLatitude(position.coords.latitude)
        }

        const error = () => {
            console.log('Unable to retrieve your location')
        }

        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser')
        } else {
            navigator.geolocation.getCurrentPosition(success, error)
        }

    }, []);

    const searchHandler = () => {

        const service_result = Query.filter((service) => {
            return service.name.toLowerCase().includes(search.toLowerCase())
        })[0]
        setServices(service_result)
        console.log(service_result)

        const sortedData = Location.sort((a, b) => {
            const distance_a = Math.sqrt(Math.pow(a.Latitude - latitude, 2) + Math.pow(a.Longitude - longitude, 2));
            const distance_b = Math.sqrt(Math.pow(b.Latitude - latitude, 2) + Math.pow(b.Longitude - longitude, 2));
            return distance_a - distance_b;
        });

        const R = 6371; // radius of the earth in km

        sortedData.map((hospital) => {
            const from = turf.point([latitude, longitude]);
            const to = turf.point([hospital.Latitude, hospital.Longitude]);
            const options = { units: 'kilometers' };
            const distance = turf.distance(from, to, options);
            console.log(distance);
            hospital.distance = distance;
            return hospital;
        });


        const result = sortedData.filter(hospital => {
            // Check if the hospital services array includes all the services in obj.services
            const res = service_result.services.every(service => {
                return hospital.services.includes(service);
            });
            return res;
        });
        console.log(result)

        setSearchResults(result)
    }

    const quickSearchHandler = (search) => {
        setSearch(search)
        searchHandler()
    }

    useEffect(() => {
        document.querySelector('.results').scrollIntoView({ behavior: 'smooth' })
    }, [searchResults])

    return (
        <div>
            <Navbar />
            <section className='white h-auto w-full'>
                <div className='flex flex-col justify-start mt-10 items-center h-full w-full'>
                    <h1 className='text-7xl max-sm:text-5xl max-sm:mx-auto mt-20 ml-10 font-bold text-center text-gray-800'>
                        <span className='text-gray-600'>Search</span>
                        <span className='text-gray-500'> Emergencies</span>
                    </h1>
                    <input type="text" placeholder="Search" className="w-1/2 max-sm:w-4/5 max-sm:mt-8 h-12 mt-8 border-2 border-gray-300 rounded-lg px-4 focus:outline-none focus:border-blue-500" onChange={e => setSearch(e.target.value)} 
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            searchHandler()
                        }
                    }}
                    />
                    <button className='bg-blue-400 hover:bg-blue-500 text-white max-sm:text-lg font-bold py-2 px-4 rounded-3xl max-sm:mx-auto mt-6 ml-10' onClick={searchHandler} role='button'>
                        Search
                    </button>
                    <div className='flex flex-wrap justify-center items-center mt-10 h-fit w-3/5'>
                        <button className='bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-3xl mt-4 ml-10 max-sm:mx-auto text-lg' onClick={() => quickSearchHandler('Pregnancy')} role='button'>
                            Pregnancy
                        </button>
                        <button className='bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-3xl mt-4 ml-10 max-sm:mx-auto text-lg' onClick={() => searchHandler('Accident')} role='button'>
                            Accident
                        </button>
                        <button className='bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-3xl mt-4 ml-10 max-sm:mx-auto text-lg' onClick={() => searchHandler('Heart Attack')} role='button'>
                            Heart Attack
                        </button>
                        <button className='bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-3xl mt-4 ml-10 max-sm:mx-auto text-lg' onClick={() => searchHandler('Burns and Scalds')} role='button'>
                            Burns and Scalds
                        </button>
                        <button className='bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-3xl mt-4 ml-10 max-sm:mx-auto text-lg' onClick={() => searchHandler('Poisoning')} role='button'>
                            Poisoning
                        </button>

                    </div>

                </div>
            </section>

            <section className='results white h-auto w-full'>
                {searchResults.length > 0 &&
                    <div className='flex flex-col justify-start mt-10 items-center h-full w-full'>
                        <h2 className='text-5xl max-sm:text-4xl max-sm:mx-auto mt-20 ml-10 font-bold text-center text-gray-800'>
                            <span className='text-gray-600'>Hospitals</span>
                            <span className='text-gray-500'> Near You</span>
                        </h2>
                        <div className='flex flex-wrap justify-center items-center mt-10 h-fit w-3/5 max-sm:w-4/5'>
                            {searchResults.slice(0, 7).map((hospital, index) => {
                                return (
                                    <Link key={index} className='bg-white shadow-md rounded-lg overflow-hidden w-2/3 m-4 h-fit p-2 max-sm:w-full ' role='button'
                                        to={{
                                            pathname: `/search/${hospital.Latitude}/${hospital.Longitude}`,
                                        }}>
                                        <div className='px-4 py-2'>
                                            <h1 className='text-xl font-bold text-gray-800'>{hospital.Name}</h1>
                                            <p className='text-gray-600 text-sm'>{`${+hospital.distance.toFixed(2)} km`}</p>
                                            {/* <p className='text-gray-600 text-sm'>{hospital.phone}</p> */}
                                        </div>
                                        {/* <div className='px-4 py-2'>
                                            {services.services.map((service) => {
                                                return <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>{service}</span>
                                            })}
                                        </div> */}

                                    </Link>
                                )
                            }
                            )}
                        </div>
                    </div>
                }
            </section>
        </div>
    )
}

export default Search