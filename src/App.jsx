import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";

import 'mapbox-gl/dist/mapbox-gl.css';
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

import marker_svg from './Assets/marker.svg';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5pcnVkaGF2MDIiLCJhIjoiY2xncDR0cGI1MGJubDNyc3UwcHhhd3BsayJ9.mqNU3ZXIGHnS5PifEDrUtQ';

function App() {
  const mapContainer = useRef(null);
  const marker = useRef(null);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [zoom, setZoom] = useState(15);
  const [hospitals, setHospitals] = useState([]);
  const [hospitalData, setHospitalData] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [map, setMap] = useState(null);


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
    map.addControl(scale);

    scale.setUnit('metric');

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });

    map.addControl(geocoder);

    const Directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
      controls: { instructions: false },
    });

    map.addControl(Directions, 'top-left');

    map.on('load', () => {
      // Use Mapbox Places API to find nearby hospitals
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/hospital.json?proximity=${longitude},${latitude}&access_token=${mapboxgl.accessToken}&limit=10`)
        .then((response) => response.json())
        .then((res) => {
          setHospitalData(res);
          setHospitals(res.features);
          console.log(res.features)

          console.log('Adding markers to map')
          hospitals.forEach((hospital) => {
            const marker = new mapboxgl.Marker({ color: '#FF0000' })
              .setLngLat(hospital.geometry.coordinates)
              .addTo(map);
            console.log('Adding event listeners to markers')

            marker.getElement().addEventListener('mouseenter', () => {
              marker.getElement().style.cursor = 'pointer';
            });

            marker.getElement().addEventListener('click', () => {
              setSelectedHospital(hospital);
            });

          });

          console.log('Fitting map to bounds')
          const bounds = new mapboxgl.LngLatBounds();
          hospitals.forEach((feature) => {
            bounds.extend(feature.geometry.coordinates);
          });
          map.fitBounds(bounds, { padding: 20 });
        })
        .catch((err) => console.log(err));
    });

    marker.current = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);

  }, []);


  useEffect(() => {
    if (!selectedHospital) return; // no hospital selected

    fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${longitude},${latitude};${selectedHospital.center[0]},${selectedHospital.center[1]}?access_token=${mapboxgl.accessToken}`)
      .then((response) => response.json())
      .then((data) => {
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
        directions.setDestination([selectedHospital.center[0], selectedHospital.center[1]]);
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
      <div ref={mapContainer} className="map-container" />
      {hospitals && hospitals.length > 0 && (
        <div className='Hospital-List'>
        {/* <h2>Hospitals</h2> */}
        <div>
          {hospitals.map((hospital) => (
            <div key={hospital.id} onClick={() => setSelectedHospital(hospital)}>
              <p>{hospital.text}</p>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}

export default App;
