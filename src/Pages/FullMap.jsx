import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { useParams } from 'react-router-dom';

import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';

const libraries = ['visualization'];

const FullMap = () => {
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

	const { lat, lon } = useParams();

	console.log(lat, lon)

	// const lat = 10.615562115554166;
	// const lon = 76.70390366819362;

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
		libraries: libraries,
	});

	const onLoad = useCallback((map) => (mapRef.current = map), []);

	const center = useMemo(() => ({ lat: latitude, lng: longitude }), [latitude, longitude]);
	const hospital = useMemo(() => ({ lat: Number(lat), lng: Number(lon) }), [lat, lon]);
	const options = useMemo(() => ({ disableDefaultUI: false }), []);

	useEffect(() => {
		const success = (position) => {
			setLongitude(position.coords.longitude);
			setLatitude(position.coords.latitude);
		};

		const error = () => {
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
		if (!isLoaded) return;
		if (!window.google) return;

		if (loadError) {
			console.log('Error loading Google Maps API:', loadError);
			return;
		}

		if (!longitude || !latitude) return;

		const directionsService = new window.google.maps.DirectionsService();

		const request = {
			origin: { lat: latitude, lng: longitude },
			destination: hospital,
			travelMode: window.google.maps.TravelMode.DRIVING,
			optimizeWaypoints: true,
		};

		directionsService.route(request, (response, status) => {
			if (status === window.google.maps.DirectionsStatus.OK) {
				setDirections(response);
				const distance = response.routes[0].legs[0].distance.text;
				setDistance(distance);
				setETA(response.routes[0].legs[0].duration.text);
				setCurrentStep(0);
			} else {
				console.log('Directions request failed:', status);
			}
		});
	}, [isLoaded, loadError, longitude, latitude, hospital]);

	const handleDirectionsChanged = () => {
		if (!directions) return;

		const route = directions.routes[0];
		const leg = route.legs[0];
		const steps = leg.steps;

		const newStep = steps.findIndex((step) => step.distance.value > leg.distance.value / 2);

		if (newStep !== currentStep) {
			setCurrentStep(newStep);
		}
	};

	useEffect(() => {
		if (isLoaded && mapLoaded && directions && window.google) {
			const trafficLayer = new window.google.maps.TrafficLayer();
			trafficLayer.setMap(mapRef.current);
			setTrafficLayer(trafficLayer);
		}

		return () => {
			if (trafficLayer) {
				trafficLayer.setMap(null);
			}
		};
	}, [isLoaded, mapLoaded, directions]);

	if (loading || loadError) {
		return (
			<div>
				<Navbar />
				<div className="full-map-container flex justify-center items-center">
					{loadError ? <p>Error loading the map</p> : <span className="loader"></span>}
				</div>
			</div>
		);
	}

	return (
		<div>
			<Navbar />
			{isLoaded && (
				<GoogleMap
					zoom={10}
					center={center}
					mapContainerClassName="flex mt-16 full-map-container"
					options={options}
					onLoad={() => {
						console.log('Map loaded');
						onLoad();
						setMapLoaded(true);
					}}
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
							<Marker
								position={hospital}
								cursor="pointer"
								onLoad={() => {
									console.log('Hospital loaded');
								}}
								label={{
									className: 'H',
									text: 'H',
									color: 'white',
								}}
								visible={true}
								opacity={1}
							/>
							{directions && (
								<>
									<DirectionsRenderer
										options={{
											directions: directions,
										}}
										onLoad={() => {
											console.log('Directions loaded');
										}}
										onDirectionsChanged={handleDirectionsChanged}
									/>
								</>
							)}
						</>
					)}
					<div className="distance">
						<p>Distance: <b>{distance}</b></p>
						<p>ETA: <b>{eta}</b></p>
					</div>
				</GoogleMap>
			)}
		</div>
	);
};

export default FullMap;

