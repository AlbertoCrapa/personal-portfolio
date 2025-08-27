/**
 * Personal Portfolio - Alberto Crapanzano (Albyeah)
 * Copyright (c) 2025 Alberto Crapanzano
 * Licensed under MIT License - see LICENSE file for details
 */

import {Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Work from "./pages/Work/Work";

import Smile from "./components/Smile/Smile";
import Simple404 from "./pages/NotFound/Simple404";
import { AnimationProvider } from "./contexts/AnimationContext";




function App() {
  return (
    <AnimationProvider>
      <Smile />

   
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/work/:slug" element={<Work />} />
        <Route path="*" element={<Simple404 />} />
      </Routes>
    </AnimationProvider>
  );
}

export default App;
