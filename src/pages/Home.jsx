import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import { DockDemo } from "../components/Dock/CustomDock";
import WorkCard from "../components/WorkCard";
import Smile from "../components/Smile";
import Preloader from "./Preloader.jsx";
import { randomWithoutRepetition } from "../utils/utils.js";
import { motion, AnimatePresence} from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [loading, setLoading] = useState(true);
  const sectionsRef = useRef([]);
  const factsTextRef = useRef();
  //const horizontalScrollerRef = useRef();

  const [currentFact, setCurrentFact] = useState('');
  const facts = require('../data/facts.json').facts;

  useEffect(() => {
    const sections = sectionsRef.current;

    sections.forEach((section, index) => {
      if (index !== 1) {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          pin: true,
          anticipatePin: 1,
          pinSpacing: false,
          scrub: true,
          snap: 1 / (sections.length - 1),
          markers: false,
        });
      }
      else {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          pinSpacing: true,
        });
      }
    });

    const updateFacts = () => {
      const newFact = randomWithoutRepetition(facts).info;
      gsap.fromTo(
        factsTextRef.current,
        { opacity: 0, y: 40 }, // Start state: transparent and slightly below
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
      setCurrentFact(newFact); // Set the new fact in state
    };

    updateFacts();
    const interval = setInterval(updateFacts, 3000);


    return () => {
      clearInterval(interval);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);


  return (

    <>
      {loading && (<Preloader setLoading={setLoading} />)}
      <Smile />
      <section ref={el => sectionsRef.current[0] = el} className=" h-dvh w-full overflow-hidden bg-zinc-100">
        <div className="absolute mr-8 font-sans  bottom-4 md:bottom-8 left-4 md:left-10 text-7xl md:text-9xl text-zinc-900">
          <h1 className="font-semibold">Albyeah</h1>
          <h1 ref={factsTextRef} className=" font-regular ease-in-out ">
            {currentFact}
          </h1>
        </div>
        {/* <DockDemo className="absolute top-10" /> */}
      </section>

      <section ref={el => sectionsRef.current[1] = el} className="relative flex h-[1900px] w-full  overflow-hidden bg-zinc-900">
        <div className="relative flex flex-col h-min w-full p-4 md:p-8 gap-8">
          <h1 className="font-sans text-8xl text-white font-bold">ABOUT ME</h1>
          <h1 className="font-sans text-8xl text-white font-bold"> my WORKS</h1>
            <WorkCard id={"modal"} />
            <WorkCard id={"modal"} />
            <WorkCard id={"modal"} />
        </div>
      </section>

      <section ref={el => sectionsRef.current[2] = el} className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-zinc-100">
        <h1 className="font-sans text-8xl font-bold text-zinc-900"> my WORKS</h1>

      </section>

      <section ref={el => sectionsRef.current[3] = el} className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-zinc-100">
        <h1>Section 4</h1>
      </section>

    </>
  );
};

export default Home;
