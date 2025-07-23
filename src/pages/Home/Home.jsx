import React from "react";
import { useEffect } from "react";
import data from "../../data/data.json";
import Navbar from "../../components/Navbar/Navbar";
import ResponsiveGrid from "../../components/ResponsiveGrid/ResponsiveGrid";
import WorkCard from "../../components/WorkCard/WorkCard";
import MailCTA from "../../components/MailCTA/MailCTA";
import Smile from "../../components/Smile/Smile";
import { useState, useRef } from "react";
import { randomWithoutRepetition } from "../../utils/utils";
import CurvedLoop from "../../utils/ReactBits/CurvedLoop/CurverdLoop";
import ScrambledText from "../../utils/ReactBits/ScrambleText/ScrambleText";
import { SplitText } from "gsap/all";
import SplitTextAnim from "../../utils/ReactBits/SplitText/SplitText";
import RotatingText from "../../utils/RotatingText/RotatingText";
import Folder from "../../utils/ReactBits/Folder/Folder";

const Home = () => {
  const { nickname, fullname, title, about, skills, projects, contact } = data;
  const factsTextRef = useRef();
  const [currentFact, setCurrentFact] = useState('');
  const facts = require('../../data/facts.json').facts;

  useEffect(() => {
  }, []);


  return (
    <div className="min-h-screen flex flex-col overscroll-none">
      <Navbar />
      {/* <CurvedLoop
        marqueeText="Be ✦ Creative ✦ With ✦ React ✦ Bits ✦"
        speed={3}
        curveAmount={500}
        direction="right"
        interactive={true}
        className="custom-text-style "
      /> */}
      <header className="bg-gray-100 ">
        <div className="container mx-auto text-left px-4">
          <h1 className="min-[390px]:text-9xl  text-7xl font-extrabold mb-2 animate-squiggly">{nickname}</h1>

          <RotatingText
            texts={facts}
            mainClassName="text-3xl text-gray-500 mb-6 notranslate"
            translate="no"
            staggerFrom={"first"}
            initial={{ y: "120%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={5000}
          />
        </div>
      </header>

      <section id="about" className="py-20">
        <div className="container mx-auto px-4 w-full md:w-2/4 mr-0 md:mr-12">
          <h2 className="text-4xl font-semibold sm:mb-1 mb-4 text-left md:ml-none  ml-auto md:max-w-none max-w-[210px]">{fullname}</h2>
          <p className="max-w-full md:max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed">
            {about.description}
          </p>
          <p className="max-w-full md:max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed">
            <br />
            {about.description2}
          </p>
          <div className="absolute bottom-[10px] right-[10px] opacity-25 items-center mt-6 animate-bounce">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
          {/* <div style={{ height: '600px', position: 'relative' }}>
            <Folder size={2} color="#3b3a3cff" className="custom-folder" />
          </div> */}
        </div>
      </section>

      <section id="projects" className="py-32 ">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-semibold mb-8 text-center">my Projects</h2>
          <ResponsiveGrid>
            {Object.values(projects).map(project => (
              <WorkCard key={project.slug} work={project} />
            ))}
          </ResponsiveGrid>
        </div>
      </section>

      <section id="contact" className="py-4 pt-32  bg-zinc-900 ">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-semibold mb-6 text-zinc-200">Get In Touch</h2>
          <MailCTA contact={contact} />
        </div>

        <p className="w-fit mx-auto bottom-0 pt-32 text-zinc-300 ">
          © 2025 Alberto Crapanzano. All rights reserved.
        </p>
      </section>
    </div>
  );
};

export default Home;