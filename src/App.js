import {Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Work from "./pages/Work/Work";
import Smile from "./components/Smile/Smile";



function App() {
  return (
    <>
      <Smile />
      <Routes>
        {/* <Route path="*" element={<>not found</>} /> */}
        <Route path="/" element={<Home/>}/>
        <Route path="/work/:slug" element={<Work />} />
      </Routes>
    </>
  );
}

export default App;
