import { useEffect } from 'react'
import { useState } from 'react'

function App() {
  const [longitude, setLongitude] = useState(0)
  const [latitude, setLatitude] = useState(0)

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

  const triggerEmergency = () => {
    console.log('EMERGENCY')
  }

  return (
    <div className="App">
      <button onClick={triggerEmergency}>Emergency</button>
      <p>Longitude: {longitude}</p>
      <p>Latitude: {latitude}</p>
    </div>
  )
}

export default App
