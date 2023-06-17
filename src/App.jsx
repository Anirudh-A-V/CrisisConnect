import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Map from "./Pages/Map";
import Search from "./Pages/Search";
import FullMap from "./Pages/FullMap";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/search" element={<Search />} />
        <Route path="/emergency" element={<Map crisis={true} />} />
        <Route path="/search/:lat/:lon" element={<FullMap />} />
        <Route path="/full-map" element={<FullMap />} />
        <Route path="/*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
