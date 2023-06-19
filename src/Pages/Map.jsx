import { useState, useRef, useEffect, useMemo, useCallback, useContext } from 'react';
import { GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';
import { GoogleMapsContext } from '../App.jsx';
import Location from '../Data/location.js';

const emergency = ["Thiruvananthapuram Medical College", "KIMS Hospital", "Cosmopolitan Hospital", "GG Hospital", "Sree Uthradom Thirunal (SUT) Hospital", "Credence Hospital", "Ananthapuri Hospitals and Research Institute (AHRI)"];

function Map({ crisis }) {
    const [hospitals, setHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);

    const mapRef = useRef();
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [loading, setLoading] = useState(true);
    const [directions, setDirections] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [distance, setDistance] = useState(0);
    const [trafficLayer, setTrafficLayer] = useState(null);
    const [eta, setETA] = useState('');
    const [mapLoaded, setMapLoaded] = useState(false);

    // const { isLoaded, loadError } = useLoadScript({
    //     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    //     libraries: libraries,
    // });

    const { isLoaded, loadError } = useContext(GoogleMapsContext);

    const onLoad = useCallback((map) => {
        mapRef.current = map;
        setMapLoaded(true);
    }, []);

    const center = useMemo(() => ({ lat: latitude, lng: longitude }), [latitude, longitude]);
    const options = useMemo(() => ({ disableDefaultUI: false }), []);

    useEffect(() => {
        const success = (position) => {
            setLongitude(position.coords.longitude);
            setLatitude(position.coords.latitude);
        };

        const error = () => {
            alert('Enable location services to use this feature')
            console.log('Unable to retrieve your location');
        };

        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
        } else {
            navigator.geolocation.getCurrentPosition(success, error);
        }
    }, []);

    useEffect(() => {
        if (longitude === 0 && latitude === 0) return;

        setLoading(false);
    }, [longitude, latitude]);


    useEffect(() => {
        console.log("Before if statement", isLoaded, window.google, mapRef.current)
        if (!isLoaded || !window.google || !mapLoaded) return;
        if (loadError) {
            console.log('Error loading Google Maps API:', loadError);
            return;
        }

        const service = new window.google.maps.places.PlacesService(mapRef.current);
        const distanceService = new window.google.maps.DistanceMatrixService();

        console.log(`Fetching ${crisis ? 'emergency ' : ''}hospitals...`);

        if (crisis) {
            const hospitals = Location.filter((hospital) => emergency.includes(hospital.Name));
            console.log("Hospitals", hospitals)
            const origin = new window.google.maps.LatLng(latitude, longitude);
            const destinations = hospitals.map((hospital) => new window.google.maps.LatLng(hospital.Latitude, hospital.Longitude))

            const request = {
                origins: [origin],
                destinations: destinations,
                travelMode: 'DRIVING', // Change travel mode as per your requirement
            };

            distanceService.getDistanceMatrix(request, (response, status) => {
                if (status === 'OK') {
                    const result = hospitals.map((hospital, index) => {
                        const distance = response.rows[0].elements[index]?.distance?.text; // Distance in kilometers
                        const duration = response.rows[0].elements[index]?.duration?.text; // Duration in seconds

                        return {
                            name: hospital.Name,
                            latitude: hospital.Latitude,
                            longitude: hospital.Longitude,
                            distance,
                            duration
                        };
                    }).sort((a, b) => a.distance - b.distance);

                    setHospitals(result);
                    console.log("Hospitals", result)
  
                } else {
                    console.log('Error calculating emergency hospital distances:', status);
                }
            })

        } else {
            const request = {
                location: new window.google.maps.LatLng(latitude, longitude),
                radius: 5000, // Search within a radius of 10km
                type: 'hospital',
            };

            service.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    // Prepare requests for distance calculation
                    const distanceRequests = results.map((hospital) => ({
                        origin: new window.google.maps.LatLng(latitude, longitude),
                        destination: hospital.geometry.location,
                        travelMode: 'DRIVING',
                    }));

                    // Calculate distances using the Distance Matrix service
                    const distanceService = new window.google.maps.DistanceMatrixService();
                    distanceService.getDistanceMatrix(
                        {
                            origins: [new window.google.maps.LatLng(latitude, longitude)],
                            destinations: distanceRequests.map((request) => request.destination),
                            travelMode: 'DRIVING',
                        },
                        (response, status) => {
                            if (status === 'OK') {
                                const { rows } = response;
                                const sortedHospitals = results
                                    .map((hospital, index) => ({
                                        id: hospital.place_id,
                                        name: hospital.name,
                                        latitude: hospital.geometry.location.lat(),
                                        longitude: hospital.geometry.location.lng(),
                                        distance: rows[0].elements[index]?.distance.text,
                                        duration: rows[0].elements[index]?.duration.text,
                                    }))
                                    .sort((a, b) => {
                                        // Sort by distance
                                        const distanceA = parseFloat(a.distance);
                                        const distanceB = parseFloat(b.distance);
                                        return distanceA - distanceB;
                                    }).slice(0, 7);

                                setHospitals(sortedHospitals);
                            } else {
                                console.log('Error calculating distances:', status);
                            }
                        }
                    );
                } else {
                    console.log('Error loading nearby places:', status);
                }
            });
        }
    }, [isLoaded, loadError, latitude, longitude, mapLoaded]);

    useEffect(() => {
        if (!isLoaded || !window.google || !mapRef.current) return;
        if (loadError) {
            console.log('Error loading Google Maps API:', loadError);
            return;
        }

        if (!selectedHospital) return;

        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
            {
                origin: new window.google.maps.LatLng(latitude, longitude),
                destination: new window.google.maps.LatLng(selectedHospital.latitude, selectedHospital.longitude),
                travelMode: 'DRIVING',
            },
            (response, status) => {
                if (status === 'OK') {
                    setDirections(response);
                    setDistance(response.routes[0].legs[0].distance.text);
                    setETA(response.routes[0].legs[0].duration.text)
                } else {
                    console.log('Error calculating directions:', status);
                }
            }
        );
    }, [isLoaded, loadError, latitude, longitude, mapRef, window, selectedHospital]);

    return (
        <div>
            <Navbar />
            {/* <h1 className='text-3xl font-bold text-center mt-10'>Hospital Locator</h1> */}
            {
                longitude === 0 && latitude === 0 && !isLoaded ? (
                    <div className="full-map-container flex justify-center items-center">
                        {loadError ? <p>Error loading the map</p> : <span className="loader"></span>}
                    </div>
                ) : (
                    <section className='Map flex flex-col justify-start sm:mt-20 items-center h-full'>
                        {isLoaded && (
                            <GoogleMap
                                zoom={13}
                                center={center}
                                mapContainerClassName="map-container w-4/5 max-sm:w-[95vw] max-sm:h-[600px]"
                                options={options}
                                onLoad={onLoad}
                            >
                                {!loading && (
                                    <>
                                        <Marker
                                            position={center}
                                            cursor="pointer"
                                            onLoad={() => {
                                                console.log('Center loaded');
                                            }}
                                            visible={true}
                                            opacity={1}
                                        />
                                        {hospitals.length > 0 && hospitals.map((hospital, index) => (
                                            <Marker
                                                key={index}
                                                position={{ lat: Number(hospital.latitude), lng: Number(hospital.longitude) }}
                                                cursor="pointer"
                                                onClick={() => {
                                                    console.log('Marker clicked:', hospital)
                                                    setSelectedHospital(hospital);
                                                }}
                                                onLoad={() => {
                                                    console.log('Hospital Marker loaded');
                                                }}
                                                visible={true}
                                                opacity={1}
                                            />
                                        ))}
                                        {directions && (
                                            <DirectionsRenderer
                                                options={{
                                                    directions: directions,
                                                    suppressMarkers: true,
                                                    polylineOptions: {
                                                        strokeColor: '#0000FF',
                                                        strokeOpacity: 0.5,
                                                        strokeWeight: 10,
                                                    },
                                                }}
                                                onLoad={() => {
                                                    console.log('Directions loaded');
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                                {directions && (
                                    <div className="distance">
                                        <p>Distance: <b>{distance}</b></p>
                                        <p>ETA: <b>{eta}</b></p>
                                    </div>
                                )}
                            </GoogleMap>
                        )}
                    </section>
                )
            }
            {hospitals && hospitals.length > 0 && (
                <section className='Hospital-List'>
                    <h1 className='text-2xl font-bold text-center mt-10'>Hospitals</h1>
                    <div className='flex flex-col justify-center items-center'>
                        {hospitals.map((hospital, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    console.log('Hospital clicked:', hospital)
                                    setSelectedHospital(hospital);
                                    document.querySelector('.Map').scrollIntoView({ behavior: 'smooth' })
                                }}
                                className='bg-white flex justify-between shadow-md rounded-lg overflow-hidden w-1/2 m-4 h-fit cursor-pointer p-2 max-sm:w-3/4 '
                            >
                                <p className='text-lg font-semibold text-gray-800 mb-1'>{hospital.name}</p>
                                <div className='flex flex-col justify-end'>
                                    <p className='text-gray-600 text-sm'>{`${hospital.distance}`}</p>
                                    <p className='text-gray-600 text-sm'>{`${hospital.duration}`}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            <Footer />
        </div>
    );
}

export default Map;