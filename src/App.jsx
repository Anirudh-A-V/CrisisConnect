import { useState, useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5pcnVkaGF2MDIiLCJhIjoiY2xncDR0cGI1MGJubDNyc3UwcHhhd3BsayJ9.mqNU3ZXIGHnS5PifEDrUtQ';

function App() {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  
  const [longitude, setLongitude] = useState(0)
  const [latitude, setLatitude] = useState(0)
  const [zoom, setZoom] = useState(12)

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
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: zoom
    });
    marker.current = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map.current);
  }, [longitude, latitude, zoom]);



  const triggerEmergency = () => {
    console.log('EMERGENCY')
  }

  return (
    <div className="App">
      <button onClick={triggerEmergency}>Emergency</button>
      <p>Longitude: {longitude}</p>
      <p>Latitude: {latitude}</p>
      <div>
        <div className="sidebar">
          Longitude: {longitude} | Latitude: {latitude} | Zoom: {zoom}
        </div>
        <div ref={mapContainer} className="map-container" 
        onScroll={() => {
          console.log('scrolling')
        }}
        />
      </div>
    </div>
  )
}

export default App
