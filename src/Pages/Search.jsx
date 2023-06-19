import { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';;
import * as turf from '@turf/turf';
import { Link, useNavigate } from 'react-router-dom';

import Location from '../Data/location.js';
import Query from '../Data/query';
import Footer from '../Components/Footer';

const Search = () => {
    const [search, setSearch] = useState('');
    const [searchquery, setSearchquery] = useState('');
    const [services, setServices] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const success = (position) => {
            setLongitude(position.coords.longitude);
            setLatitude(position.coords.latitude);
            console.log('Longitude: ' + position.coords.longitude);
            console.log('Latitude: ' + position.coords.latitude);
        };

        const options = {
            enableHighAccuracy: true,
            timeout: 5000, // Maximum time allowed for position retrieval
            maximumAge: 0, // Don't use a cached position
        };

        const error = () => {
            alert('Enable location services to use this feature')
            console.log('Unable to retrieve your location');
        };

        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
        } else {
            navigator.geolocation.getCurrentPosition(success, error, options);
        }
    }, []);

    const searchHandler = () => {
        if (!search || !latitude || !longitude) {
            return;
        }

        const serviceResult = Query.find((service) =>
            service.name.toLowerCase().includes(search.toLowerCase())
        );

        if (!serviceResult) {
            return;
        }

        setServices(serviceResult);
        console.log(serviceResult);

        const service = new window.google.maps.DistanceMatrixService();

        const sortedData = Location.map((hospital) => {
            const from = turf.point([latitude, longitude]);
            const to = turf.point([hospital.Latitude, hospital.Longitude]);
            const options = { units: 'kilometers' };
            const distance = turf.distance(from, to, options);
            console.log(distance);
            return { ...hospital, distance };
        }).sort((a, b) => a.distance - b.distance);
        console.log("sortedData", sortedData)

        const result1 = sortedData.filter((hospital) =>
            serviceResult.services.some((service) => hospital.services.includes(service))
        );
        console.log("result1", result1)

        const origin = new window.google.maps.LatLng(latitude, longitude);
        const destinations = result1.map((hospital) => new window.google.maps.LatLng(hospital.Latitude, hospital.Longitude)).slice(0, 7)
        console.log("destinations", destinations)

        const request = {
            origins: [origin],
            destinations: destinations,
            travelMode: 'DRIVING', // Change travel mode as per your requirement
        };

        service.getDistanceMatrix(request, (response, status) => {
            if (status === 'OK') {
                const result = result1.slice(0, 7).map((hospital, index) => {
                    const distance = response.rows[0].elements[index]?.distance.value / 1000; // Distance in kilometers
                    const duration = response.rows[0].elements[index]?.duration.text; // Duration in seconds

                    return { ...hospital, distance, duration };
                }).sort((a, b) => a.distance - b.distance);

                const filteredResult = result.filter((hospital) =>
                    serviceResult.services.some((service) => hospital.services.includes(service))
                );

                console.log(filteredResult);
                setSearchResults(filteredResult);
            } else {
                console.log('Error calculating distances:', status);
            }
        });
    };

    const quickSearchHandler = (search) => {
        setSearch(search);
    };

    useEffect(() => {
        searchHandler();
    }, [search]);

    useEffect(() => {
        searchHandler();
    }, [latitude, longitude]);

    useEffect(() => {
        document.querySelector('.results').scrollIntoView({ behavior: 'smooth' });
    }, [searchResults]);

    return (
        <div>
            <Navbar />
            <section className='white max-sm:h-full h-auto w-full'>
                <div className='flex flex-col justify-start mt-10 items-center h-full w-full'>
                    <h1 className='text-7xl max-sm:text-5xl max-sm:mx-auto mt-20 ml-10 font-bold text-center text-gray-800'>
                        <span className='text-gray-600'>Search</span>
                        <span className='text-gray-500'> Emergencies</span>
                    </h1>
                    <input type="text" placeholder="Search" className="w-1/2 max-sm:w-4/5 max-sm:mt-8 h-12 mt-8 border-2 border-gray-300 rounded-lg px-4 focus:outline-none focus:border-blue-500" onChange={e => setSearchquery(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                setSearch(searchquery)
                                searchHandler()
                            }
                        }}
                        list="searchSuggestions"
                    />
                    <datalist id="searchSuggestions">
                        {Query.map((keyword, index) => (
                            <option key={index} value={keyword.name} />
                        ))}
                    </datalist>
                    <button className='bg-blue-400 hover:bg-blue-500 text-white max-sm:text-lg font-bold py-2 px-4 rounded-3xl max-sm:mx-auto mt-6 ml-10' onClick={() => {
                        setSearch(searchquery)
                        searchHandler()
                    }} role='button'>
                        Search
                    </button>
                    <div className='flex flex-wrap justify-center items-center mt-10 h-fit w-3/5'>
                        <button className='bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-3xl mt-4 ml-10 max-sm:mx-auto text-lg' onClick={() => quickSearchHandler('Pregnancy')} role='button'>
                            Pregnancy
                        </button>
                        <button className='bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-3xl mt-4 ml-10 max-sm:mx-auto text-lg' onClick={() => quickSearchHandler('Accident')} role='button'>
                            Accident
                        </button>
                        <button className='bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-3xl mt-4 ml-10 max-sm:mx-auto text-lg' onClick={() => quickSearchHandler('Heart Attack')} role='button'>
                            Heart Attack
                        </button>
                        <button className='bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-3xl mt-4 ml-10 max-sm:mx-auto text-lg' onClick={() => quickSearchHandler('Burns and Scalds')} role='button'>
                            Burns and Scalds
                        </button>
                        <button className='bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-3xl mt-4 ml-10 max-sm:mx-auto text-lg' onClick={() => quickSearchHandler('Poisoning')} role='button'>
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
                            {searchResults.map((hospital, index) => {
                                return (
                                    <Link key={index} className='bg-white shadow-md rounded-lg overflow-hidden w-2/3 m-4 h-fit p-2 max-sm:w-full ' role='button'
                                        to={{
                                            pathname: `/search/${hospital.Latitude}/${hospital.Longitude}`,
                                        }}>
                                        <div className='flex justify-between px-4 py-2'>
                                            <h1 className='text-xl font-bold text-gray-800'>{hospital.Name}</h1>
                                            <div className='flex items-end flex-col'>
                                                <p className='text-gray-600 text-sm'>{`${+hospital.distance.toFixed(2)} km`}</p>
                                                <p className='text-gray-600 text-sm'>{`${hospital.duration}`}</p>
                                            </div>
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
            {/* <Footer /> */}
        </div>
    )
}

export default Search