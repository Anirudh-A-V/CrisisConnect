import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import marker_svg from'./Assets/marker.svg';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5pcnVkaGF2MDIiLCJhIjoiY2xncDR0cGI1MGJubDNyc3UwcHhhd3BsayJ9.mqNU3ZXIGHnS5PifEDrUtQ';

function App() {
  const mapContainer = useRef(null);
  const marker = useRef(null);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [zoom, setZoom] = useState(15);
  const [hospitals, setHospitals] = useState([]);
  const [hospitalData, setHospitalData] = useState(null);

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
  
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });
  
    map.addControl(geocoder);
  
    map.on('load', () => {
      // Use Mapbox Places API to find nearby hospitals
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/hospital.json?proximity=${longitude},${latitude}&access_token=${mapboxgl.accessToken}&limit=10`)
        .then((response) => response.json())
        .then((res) => {
          setHospitalData(res);
          setHospitals(res.features);
          console.log(res.features)

          // const image = new Image(15, 15);
          // image.src = marker_svg;
          // map.addImage('hospital-15', image);

          hospitals.forEach((hospital) => {
            const marker = new mapboxgl.Marker({ color: '#FF0000' }).setLngLat(hospital.geometry.coordinates).addTo(map);
          });
  
          // Center map to the extent of the hospital markers
          const bounds = new mapboxgl.LngLatBounds();
          hospitals.forEach((feature) => {
            bounds.extend(feature.geometry.coordinates);
          });
          map.fitBounds(bounds, { padding: 20 });
        })
        .catch((err) => console.log(err));
    });
  
    marker.current = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
  
  }, [longitude, latitude, zoom]);
  

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;
