import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Map from "./Pages/Map";
import Search from "./Pages/Search";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
