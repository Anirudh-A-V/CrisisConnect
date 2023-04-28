import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import * as turf from '@turf/turf';

import 'mapbox-gl/dist/mapbox-gl.css';
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

import Data from '../Data/location.js';
import Navbar from '../Components/Navbar.jsx';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5pcnVkaGF2MDIiLCJhIjoiY2xncDR0cGI1MGJubDNyc3UwcHhhd3BsayJ9.mqNU3ZXIGHnS5PifEDrUtQ';

function Map() {
    const mapContainer = useRef(null);
    const marker = useRef(null);
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [zoom, setZoom] = useState(15);
    const [hospitals, setHospitals] = useState([]);
    const [hospitalData, setHospitalData] = useState(null);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [map, setMap] = useState(null);


    const filterHospitals = () => {
        
        // sort Data by distance
        const sortedData = Data.sort((a, b) => {
            const distance_a = Math.sqrt(Math.pow(a.Latitude - latitude, 2) + Math.pow(a.Longitude - longitude, 2));
            const distance_b = Math.sqrt(Math.pow(b.Latitude - latitude, 2) + Math.pow(b.Longitude - longitude, 2));
            return distance_a - distance_b;
        });

        const R = 6371; // radius of the earth in km

        // sortedData.map((hospital) => {
        //     const lat1 = latitude;
        //     const lon1 = longitude;
        //     const lat2 = hospital.Latitude;
        //     const lon2 = hospital.Longitude;

        //     const dLat = (lat2 - lat1) * Math.PI / 180;
        //     const dLon = (lon2 - lon1) * Math.PI / 180;
        //     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        //         Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        //         Math.sin(dLon / 2) * Math.sin(dLon / 2);
        //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        //     const distance = R * c;

        //     console.log(distance);
        //     hospital.distance = distance;
        //     return hospital;
        // })

        sortedData.map((hospital) => {
            // console.log('hospital', hospital)
            // console.log('latitude', latitude)
            // console.log('longitude', longitude)
            const from = turf.point([latitude, longitude]);
            // console.log('from', from)
            const to = turf.point([hospital.Latitude, hospital.Longitude]);
            // console.log('to', to)
            const options = { units: 'kilometers' };
            const distance = turf.distance(from, to, options);
            console.log(distance);
            hospital.distance = distance;
            return hospital;
        });


        setHospitals(sortedData.slice(0, 7))
    }


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

    useEffect(() => {
        if (longitude === 0 && latitude === 0) return; // wait for location to be retrieved    
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [longitude, latitude],
            zoom: zoom
        });
        setMap(map);

        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true,
            showAccuracyCircle: true,
            showUserLocation: true,
            fitBoundsOptions: {
                maxZoom: 15
            },
        }), 'bottom-right');

        const nav = new mapboxgl.NavigationControl();
        // map.addControl(nav, 'top-left');

        const scale = new mapboxgl.ScaleControl({
            maxWidth: 80,
            unit: 'imperial'
        });
        // map.addControl(scale);

        // scale.setUnit('metric');

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
        });

        // map.addControl(geocoder);

        const Directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            unit: 'metric',
            profile: 'mapbox/driving',
            controls: { instructions: false },
        });

        map.addControl(Directions, 'top-left');

        filterHospitals();

        // map.on('load', () => {
        //     // Use Mapbox Places API to find nearby hospitals
        //     fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/hospital.json?proximity=${longitude},${latitude}&access_token=${mapboxgl.accessToken}&limit=10`)
        //         .then((response) => response.json())
        //         .then((res) => {
        //             setHospitalData(res);
        //             setHospitals(res.features);
        //             console.log(res.features)

        //             console.log('Adding markers to map')
        //             hospitals.forEach((hospital) => {
        //                 const marker = new mapboxgl.Marker({ color: '#FF0000' })
        //                     .setLngLat(hospital.geometry.coordinates)
        //                     .addTo(map);
        //                 console.log('Adding event listeners to markers')

        //                 marker.getElement().addEventListener('mouseenter', () => {
        //                     marker.getElement().style.cursor = 'pointer';
        //                 });

        //                 marker.getElement().addEventListener('click', () => {
        //                     setSelectedHospital(hospital);
        //                 });

        //             });

        //             console.log('Fitting map to bounds')
        //             const bounds = new mapboxgl.LngLatBounds();
        //             hospitals.forEach((feature) => {
        //                 bounds.extend(feature.geometry.coordinates);
        //             });
        //             map.fitBounds(bounds, { padding: 20 });
        //         })
        //         .catch((err) => console.log(err));
        // });

        marker.current = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);

    }, [latitude, longitude]);

    useEffect(() => {
        if (hospitals.length === 0) return; // wait for hospitals to be loaded

        hospitals.forEach((hospital) => {
            console.log('Adding markers to map')
            const marker = new mapboxgl.Marker({ color: '#FF0000' })
                .setLngLat([hospital.Longitude, hospital.Latitude])
                .addTo(map);

            marker.getElement().addEventListener('mouseenter', () => {
                marker.getElement().style.cursor = 'pointer';
            });

            marker.getElement().addEventListener('click', () => {
                setSelectedHospital(hospital);
            });

        });

        const bounds = new mapboxgl.LngLatBounds();
        hospitals.forEach((hospital) => {
            bounds.extend([parseFloat(hospital.Longitude), parseFloat(hospital.Latitude)]);
        })
        map.fitBounds(bounds, { padding: 20 });

        document.querySelector('.Hospital-List').scrollIntoView({ behavior: 'smooth' });
    }, [hospitals]);


    useEffect(() => {
        if (!selectedHospital) return; // no hospital selected

        fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${longitude},${latitude};${selectedHospital.Longitude},${selectedHospital.Latitude}?access_token=${mapboxgl.accessToken}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                console.log(data.routes[0].geometry);
                console.log('Creating new directions control')


                const directions = new MapboxDirections({
                    accessToken: mapboxgl.accessToken,
                    unit: 'metric',
                    profile: 'mapbox/driving',
                    controls: { instructions: false },
                });

                console.log('Adding route to map')
                console.log(data.routes[0].geometry)
                directions.setOrigin([longitude, latitude]);
                directions.setDestination([selectedHospital.Longitude, selectedHospital.Latitude]);
                directions.addRoute(data.routes[0].geometry);
                map.addControl(directions, 'top-left');
                map.fitBounds(directions.getBounds(), { padding: 20 });
            })
            .catch((err) => console.log(err));


        return () => {
            if (map.getSource('route')) {
                map.removeLayer('route');
                map.removeSource('route');
                map.removeControl(directions);
            }
        };
    }, [selectedHospital]);



    return (
        <div>
            <Navbar />
            {/* <h1 className='text-3xl font-bold text-center mt-10'>Hospital Locator</h1> */}
            {
                longitude === 0 && latitude === 0 && mapContainer === null ? (
                    <div className='flex flex-col justify-center items-center h-screen'>
                        <p className='font-normal text-xl'>Loading...</p>
                    </div>
                ) : (
                    <section className='Map flex flex-col justify-start sm:mt-20 items-center h-full'>
                        <div className='flex flex-row justify-center items-center w-full'>
                            <div ref={mapContainer} className='map-container w-4/5 max-sm:w-[95vw] max-sm:h-[600px]' />
                        </div>
                    </section>
                )
            }
            {hospitals && hospitals.length > 0 && (
                <section className='Hospital-List'>
                    <h1 className='text-2xl font-bold text-center mt-10'>Hospitals</h1>
                    <div className='flex flex-col justify-center items-center'>
                        {hospitals.map((hospital) => (
                            <div key={hospital.id} onClick={() => {
                                setSelectedHospital(hospital)
                                document.querySelector('.Map').scrollIntoView({ behavior: 'smooth' })
                            }} className='bg-white shadow-md rounded-lg overflow-hidden w-1/2 m-4 h-fit cursor-pointer p-2 max-sm:w-3/4 '>
                                <p className='text-xl font-bold text-gray-800 mb-1'>{hospital.Name}</p>
                                <div className='flex flex-row justify-end'>
                                    {/* <p className='font-normal text-sm mr-2'>{hospital.Latitude}</p>
                  <p className='font-normal text-sm'>{hospital.Longitude}</p> */}
                                    <p className='text-gray-600 text-sm'>{`${+hospital.distance.toFixed(2)} km`}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default Map;
