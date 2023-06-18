import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLoadScript } from "@react-google-maps/api";
import { createContext } from "react";

import Home from "./Pages/Home";
import Map from "./Pages/Map";
import Search from "./Pages/Search";
import FullMap from "./Pages/FullMap";

const libraries = ["visualization", "places"];

// Create a context for isLoaded and loadError
export const GoogleMapsContext = createContext({
  isLoaded: false,
  loadError: null,
});

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/search" element={<Search />} />
          <Route path="/emergency" element={<Map crisis={true} />} />
          <Route path="/search/:lat/:lon" element={<FullMap />} />
          <Route path="/*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </GoogleMapsContext.Provider>
  );
}

export default App;
