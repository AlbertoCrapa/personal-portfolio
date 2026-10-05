/**
 * Personal Portfolio - Alberto Crapanzano (Albyeah)
 * Copyright (c) 2025 Alberto Crapanzano
 * Licensed under MIT License - see LICENSE file for details
 */

import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./layouts/Layout";
import PageReveal from "./components/ui/PageReveal";
import WelcomeChat from "./components/ui/WelcomeChat";

// Loaders kept apart from lazy() so they can also be warmed up after the
// first page settles: the next navigation then rarely waits on the network.
const pages = {
  Home: () => import("./pages/Home/Home"),
  Projects: () => import("./pages/Projects/Projects"),
  Playground: () => import("./pages/Playground/Playground"),
  Experience: () => import("./pages/Experience/Experience"),
  Work: () => import("./pages/Work/Work"),
  BlogList: () => import("./pages/Blog/BlogList"),
  BlogPage: () => import("./pages/Blog/BlogPage"),
  Privacy: () => import("./pages/Privacy/Privacy"),
  Simple404: () => import("./pages/NotFound/Simple404"),
};

const Home = lazy(pages.Home);
const Projects = lazy(pages.Projects);
const Playground = lazy(pages.Playground);
const Experience = lazy(pages.Experience);
const Work = lazy(pages.Work);
const BlogList = lazy(pages.BlogList);
const BlogPage = lazy(pages.BlogPage);
const Privacy = lazy(pages.Privacy);
const Simple404 = lazy(pages.Simple404);

function App() {
  const { pathname } = useLocation();

  // Expose the real scrollbar width as a CSS var so full-bleed (100vw) elements
  // can subtract it and never overflow when the scrollbar appears/disappears.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateScrollbarWidth = () => {
      const width = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty(
        "--scrollbar-width",
        `${Math.max(0, width)}px`,
      );
    };

    // Wait a frame: on mount the first layout can still report a full-width
    // client rect, which would pin the var at 0px for the rest of the session.
    const raf = requestAnimationFrame(updateScrollbarWidth);
    window.addEventListener("resize", updateScrollbarWidth);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateScrollbarWidth);
    };
  }, []);

  // `-webkit-user-drag: none` (theme.css) covers Chromium and Safari; Firefox
  // ignores it, so block the native drag of any media element here too.
  useEffect(() => {
    const id = window.setTimeout(() => {
      Object.values(pages).forEach((load) => load().catch(() => {}));
    }, 2500);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const blockMediaDrag = (e) => {
      const el = e.target;
      if (el instanceof Element && el.matches("img, video, canvas")) {
        e.preventDefault();
      }
    };
    document.addEventListener("dragstart", blockMediaDrag);
    return () => document.removeEventListener("dragstart", blockMediaDrag);
  }, []);

  return (
    <Layout>
      {/* No skeleton: navigations run in a transition (index.js), so the
          current page stays until the next one is ready and makes its own
          entrance. Only the very first load shows the empty canvas. */}
      <Suspense fallback={null}>
        <PageReveal key={pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/playground/:slug/play" element={<Experience />} />
            <Route
              path="/playground/:slug"
              element={<Work source="playground" />}
            />
            <Route path="/work/:slug" element={<Work />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<Simple404 />} />
          </Routes>
        </PageReveal>
      </Suspense>
      <WelcomeChat />
    </Layout>
  );
}

export default App;
