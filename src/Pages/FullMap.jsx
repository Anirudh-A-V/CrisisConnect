import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import * as turf from '@turf/turf';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

import { useParams } from 'react-router-dom';

import 'mapbox-gl/dist/mapbox-gl.css';
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

import Data from '../Data/location.js';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5pcnVkaGF2MDIiLCJhIjoiY2xncDR0cGI1MGJubDNyc3UwcHhhd3BsayJ9.mqNU3ZXIGHnS5PifEDrUtQ';

const FullMap = () => {
    const mapContainer = useRef(null);
    const marker = useRef(null);
    const mapRef = useRef();
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [zoom, setZoom] = useState(15);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [map, setMap] = useState(null);
    const [loading, setLoading] = useState(true);

    // const { lat, lon } = useParams();

    const lat = 10.615562115554166;
    const lon = 76.70390366819362;


    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    const onLoad = useCallback((map) => (mapRef.current = map), []);

    const center = useMemo(() => {
        return { lat: latitude, lng: longitude };
    }, [latitude, longitude]);

    const hospital = useMemo(() => {
        return { lat: lat, lng: lon };
    }, [lat, lon]);

    const options = useMemo(
        () => ({
            disableDefaultUI: false,
        }),
        []
    );

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
        // console.log(longitude, lat, lon)

    }, []);

    useEffect(() => {
        if (longitude === 0 && latitude === 0) return; // wait for location to be retrieved
        if (!isLoaded) return;
        console.log("coordinates", longitude, latitude)
        setLoading(false);
    }, [longitude, latitude, isLoaded]);



    // useEffect(() => {
    //     if (longitude === 0 && latitude === 0) return; // wait for location to be retrieved
    //     const map = new mapboxgl.Map({
    //         container: mapContainer.current,
    //         style: 'mapbox://styles/mapbox/streets-v12',
    //         center: [longitude, latitude],
    //         zoom: zoom
    //     });
    //     setMap(map);

    //     map.addControl(new mapboxgl.GeolocateControl({
    //         positionOptions: {
    //             enableHighAccuracy: true
    //         },
    //         trackUserLocation: true,
    //         showUserHeading: true,
    //         showAccuracyCircle: true,
    //         showUserLocation: true,
    //         fitBoundsOptions: {
    //             maxZoom: 15
    //         },
    //     }), 'bottom-right');

    //     const nav = new mapboxgl.NavigationControl();
    //     // map.addControl(nav, 'top-left');

    //     const scale = new mapboxgl.ScaleControl({
    //         maxWidth: 80,
    //         unit: 'imperial'
    //     });
    //     // map.addControl(scale);

    //     // scale.setUnit('metric');

    //     const geocoder = new MapboxGeocoder({
    //         accessToken: mapboxgl.accessToken,
    //         mapboxgl: mapboxgl,
    //     });

    //     // map.addControl(geocoder);

    //     const Directions = new MapboxDirections({
    //         accessToken: mapboxgl.accessToken,
    //         unit: 'metric',
    //         profile: 'mapbox/driving',
    //         controls: { instructions: false },
    //     });

    //     map.addControl(Directions, 'top-left');

    //     const hospitalMarker = new mapboxgl.Marker({ color: '#FF0000' }).setLngLat([lon, lat]).addTo(map);
    //     hospitalMarker.getElement().addEventListener('mouseenter', () => {
    //         hospitalMarker.getElement().style.cursor = 'pointer';
    //     });

    //     const bounds = new mapboxgl.LngLatBounds();
    //     bounds.extend([lon, lat]);
    //     bounds.extend([longitude, latitude]);
    //     map.fitBounds(bounds, { padding: 200 });

    //     setSelectedHospital(
    //         {
    //             Longitude: lon,
    //             Latitude: lat
    //         }
    //     )

    //     marker.current = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
    //     console.log(selectedHospital)
    // }, [latitude, longitude]);

    // useEffect(() => {

    //     if (!selectedHospital) return; // no hospital selected

    //     const directions = new MapboxDirections({
    //         accessToken: mapboxgl.accessToken,
    //         unit: 'metric',
    //         profile: 'mapbox/driving',
    //         controls: { instructions: false },
    //     });

    //     fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${longitude},${latitude};${selectedHospital.Longitude},${selectedHospital.Latitude}?access_token=${mapboxgl.accessToken}`)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log(data)
    //             console.log(data.routes[0].geometry);
    //             console.log('Creating new directions control')

    //             console.log('Adding route to map')
    //             console.log(data.routes[0].geometry)
    //             directions.setOrigin([longitude, latitude]);
    //             directions.setDestination([selectedHospital.Longitude, selectedHospital.Latitude]);
    //             directions.addRoute(data.routes[0].geometry);
    //             map.addControl(directions, 'top-left');
    //             map.fitBounds(directions.getBounds(), { padding: 20 });
    //         })
    //         .catch((err) => console.log(err));


    //     return () => {
    //         if (map.getSource('route')) {
    //             map.removeLayer('route');
    //             map.removeSource('route');
    //             map.removeControl(directions);
    //         }
    //     };
    // }, [selectedHospital]);

    if (loading) return (
        <div>
            <Navbar />
            <div className="full-map-container flex justify-center items-center">
                <span className="loader"></span>
            </div>
        </div>
    )

    return (
        <div>
            <Navbar />
            {/* <div className="full-map-container" ref={mapContainer} /> */}
            <GoogleMap
                zoom={10}
                center={center}
                mapContainerClassName="flex mt-16 full-map-container"
                options={options}
                onLoad={() => {
                    console.log('Map loaded');
                    onLoad();
                }}
            >
                {isLoaded && (
                    <>
                        <Marker
                            position={center}
                            cursor="pointer"
                            onLoad={() => {
                                console.log('Center loaded');
                            }}
                            icon={{
                                // Specify a custom icon URL or use a built-in icon from the Google Maps library
                                url: 'https://firebasestorage.googleapis.com/v0/b/enlive-cet.appspot.com/o/marker.svg?alt=media&token=d1ab8747-07d3-4777-b973-92f0e7648668',
                                scaledSize: new window.google.maps.Size(40, 40), // Adjust the size of the icon
                            }}
                            visible={true}
                            zIndex={100}
                            opacity={1}
                        />
                        <Marker
                            position={hospital}
                            cursor="pointer"
                            onLoad={() => {
                                console.log('Hospital loaded');
                            }
                            }
                            icon={{
                                // Specify a custom icon URL or use a built-in icon from the Google Maps library
                                url: 'https://firebasestorage.googleapis.com/v0/b/enlive-cet.appspot.com/o/hospital.svg?alt=media&token=3b0b8b1e-7b0a-4b0e-9b0a-9b0b0b0b0b0b',
                                scaledSize: new window.google.maps.Size(40, 40), // Adjust the size of the icon
                            }}
                            visible={true}
                            zIndex={100}
                            opacity={1}
                        />
                    </>
                )}
            </GoogleMap>
            {/* <Footer /> */}
        </div>
    )
}

// { lat: 10.605765318046307, lng: 76.76204115860467 }
export default FullMap;