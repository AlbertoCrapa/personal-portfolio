/**
 * Personal Portfolio - Alberto Crapanzano (Albyeah)
 * Copyright (c) 2025 Alberto Crapanzano
 * Licensed under MIT License - see LICENSE file for details
 */

import { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import data from "./data/data.json";
import { useNotification } from "./components/ui/NotificationProvider";

const Home = lazy(() => import("./pages/Home/Home"));
const About = lazy(() => import("./pages/About/About"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const Playground = lazy(() => import("./pages/Playground/Playground"));
const Work = lazy(() => import("./pages/Work/Work"));
const BlogList = lazy(() => import("./pages/Blog/BlogList"));
const BlogPage = lazy(() => import("./pages/Blog/BlogPage"));
const Privacy = lazy(() => import("./pages/Privacy/Privacy"));
const Simple404 = lazy(() => import("./pages/NotFound/Simple404"));

function App() {
  const { notify } = useNotification();

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
    <Suspense
      fallback={
        <div className="min-h-svh bg-bg text-text-secondary flex items-center justify-center px-4">
          Loading page...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/playground" element={<Playground />} />
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
  );
}

export default App;
