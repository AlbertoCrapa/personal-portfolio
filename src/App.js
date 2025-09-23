/**
 * Personal Portfolio - Alberto Crapanzano (Albyeah)
 * Copyright (c) 2025 Alberto Crapanzano
 * Licensed under MIT License - see LICENSE file for details
 */


import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Work from "./pages/Work/Work";
import BlogList from "./pages/Blog/BlogList";
import BlogPage from "./pages/Blog/BlogPage";
import Smile from "./components/Smile/Smile";
import Simple404 from "./pages/NotFound/Simple404";
import { AnimationProvider } from "./contexts/AnimationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Cursor from "./components/Cursor/Cursor";




function App() {
  return (
    <ThemeProvider>
      <AnimationProvider>
        <Cursor />
        <Smile />

     
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<Work />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
          <Route path="*" element={<Simple404 />} />
        </Routes>
      </AnimationProvider>
    </ThemeProvider>
  );
}

export default App;
