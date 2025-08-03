import {Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Work from "./pages/Work/Work";

import Smile from "./components/Smile/Smile";
import Simple404 from "./pages/NotFound/Simple404";



function App() {
  return (
    <>
      <Smile />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/work/:slug" element={<Work />} />
        <Route path="*" element={<Simple404 />} />
      </Routes>
    </>
  );
}

export default App;
