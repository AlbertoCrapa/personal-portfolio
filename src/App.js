/**
 * Personal Portfolio - Alberto Crapanzano (Albyeah)
 * Copyright (c) 2025 Alberto Crapanzano
 * Licensed under MIT License - see LICENSE file for details
 */

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Projects from "./pages/Projects/Projects";
import Playground from "./pages/Playground/Playground";
import Work from "./pages/Work/Work";
import BlogList from "./pages/Blog/BlogList";
import BlogPage from "./pages/Blog/BlogPage";
import Simple404 from "./pages/NotFound/Simple404";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/playground" element={<Playground />} />
      <Route path="/playground/:slug" element={<Work source="playground" />} />
      <Route path="/work/:slug" element={<Work />} />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:slug" element={<BlogPage />} />
      <Route path="*" element={<Simple404 />} />
    </Routes>
  );
}

export default App;
