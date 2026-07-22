/**
 * Personal Portfolio - Alberto Crapanzano (Albyeah)
 * Copyright (c) 2025 Alberto Crapanzano
 * Licensed under MIT License - see LICENSE file for details
 */

import { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import data from "./data/data.json";
import { useNotification } from "./components/ui/NotificationProvider";
import Layout from "./layouts/Layout";

const Home = lazy(() => import("./pages/Home/Home"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const Playground = lazy(() => import("./pages/Playground/Playground"));
const Experience = lazy(() => import("./pages/Experience/Experience"));
const Work = lazy(() => import("./pages/Work/Work"));
const BlogList = lazy(() => import("./pages/Blog/BlogList"));
const BlogPage = lazy(() => import("./pages/Blog/BlogPage"));
const Privacy = lazy(() => import("./pages/Privacy/Privacy"));
const Simple404 = lazy(() => import("./pages/NotFound/Simple404"));

function App() {
  const { notify } = useNotification();

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
    const blockMediaDrag = (e) => {
      const el = e.target;
      if (el instanceof Element && el.matches("img, video, canvas")) {
        e.preventDefault();
      }
    };
    document.addEventListener("dragstart", blockMediaDrag);
    return () => document.removeEventListener("dragstart", blockMediaDrag);
  }, []);

  useEffect(() => {
    const sessionKey = "albyeah-session-welcome-shown";
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(sessionKey)) return;

    const config = data?.homepage?.notifications?.sessionWelcome || {};
    if (config.enabled === false) return;

    const delay = Number.isFinite(config.delayMs) ? config.delayMs : 6500;
    const timeoutId = window.setTimeout(
      () => {
        notify({
          type: "message",
          title: config.title || "Welcome to my portfolio",
          message:
            config.message ||
            "Take a look around and have fun exploring projects, experiments, and dev stories.",
          duration: Number.isFinite(config.durationMs)
            ? config.durationMs
            : 7000,
        });
        window.sessionStorage.setItem(sessionKey, "1");
      },
      Math.max(800, delay),
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [notify]);

  return (
    <Layout>
      <Suspense
        fallback={
          <div className="min-h-[60svh] text-text-secondary flex items-center justify-center px-4">
            Loading page...
          </div>
        }
      >
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
      </Suspense>
    </Layout>
  );
}

export default App;
