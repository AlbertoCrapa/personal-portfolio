import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import { DockDemo } from "../components/Dock/CustomDock";
import WorkCard from "../components/WorkCard";
import Smile from "../components/Smile";
import Preloader from "./Preloader.jsx";
import { randomWithoutRepetition } from "../utils/utils.js";
import { motion, AnimatePresence} from "framer-motion";
import MailCTA from "../components/MailCTA.jsx";

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
      <section ref={el => sectionsRef.current[0] = el} className="fixed h-dvh w-full overflow-hidden bg-zinc-100">
        <div className="absolute mr-8 font-sans  bottom-4 md:bottom-8 left-4 md:left-10 text-7xl md:text-9xl text-zinc-900">
          <h1 className=" font-semibold" >Albyeah</h1>
          <h1 ref={factsTextRef} className=" font-regular ease-in-out ">
            {currentFact}
          </h1>
        </div>
        {/* <DockDemo className="absolute top-10" /> */}
      </section>

      <section ref={el => sectionsRef.current[1] = el} className="relative flex-row h-fit w-full  overflow-hidden bg-zinc-900 p-4 md:p-8">
        <h1 className="font-sans text-8xl text-white font-bold ">ABOUT ME</h1>
        <h1 className="font-sans text-8xl text-white font-bold mb-10"> my WORKS</h1>
        <div className="relative flex flex-row h-min w-full gap-y-16 gap-x-8 flex-wrap ">
          
            <WorkCard id={"modal"} />
            <WorkCard id={"modal"} />
            <WorkCard id={"modal"} />
            <WorkCard id={"modal"} />
            <WorkCard id={"modal"} />
            <WorkCard id={"modal"} />
        </div>
      </section>

      <section ref={el => sectionsRef.current[2] = el} className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-zinc-100">
        <h1 className="font-sans text-8xl font-bold text-zinc-900 animate-squiggly"> my WORKS</h1>
      </section>

      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" fill="red" className="vanity__squid"><defs><filter id="squiggly-0"><feTurbulence id="turbulence" baseFrequency="0.01" numOctaves="10" result="noise" seed="0"></feTurbulence><feDisplacementMap id="displacement" in="SourceGraphic" in2="noise" scale="3"></feDisplacementMap></filter><filter id="squiggly-1"><feTurbulence id="turbulence" baseFrequency="0.01" numOctaves="10" result="noise" seed="0.5"></feTurbulence><feDisplacementMap in="SourceGraphic" in2="noise" scale="4"></feDisplacementMap></filter><filter id="squiggly-2"><feTurbulence id="turbulence" baseFrequency="0.01" numOctaves="10" result="noise" seed="1"></feTurbulence><feDisplacementMap in="SourceGraphic" in2="noise" scale="3"></feDisplacementMap></filter><filter id="squiggly-3"><feTurbulence id="turbulence" baseFrequency="0.01" numOctaves="10" result="noise" seed="1.5"></feTurbulence><feDisplacementMap in="SourceGraphic" in2="noise" scale="4"></feDisplacementMap></filter><filter id="squiggly-4"><feTurbulence id="turbulence" baseFrequency="0.01" numOctaves="10" result="noise" seed="2"></feTurbulence><feDisplacementMap in="SourceGraphic" in2="noise" scale="3"></feDisplacementMap></filter></defs></svg>

      <section ref={el => sectionsRef.current[3] = el} className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-zinc-900 flex-col">
        <h1 className="font-sans text-xl text-white font-bold">WORK WITH ME</h1>
        <p className=" box-border text-white mb-9 px-[10%] md:px-[28%] leading-6 text-center text-xl ">I design creative websites that help your audience enjoy learning about you with a mix of storytelling, witty writing and micro interactions. </p>
        <MailCTA/>
      </section>

    </>
  );
};

export default Home;
