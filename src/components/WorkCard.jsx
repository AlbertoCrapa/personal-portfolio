import React from "react";
import { motion } from "framer-motion";



const WorkCard = ({id}) => {

  return (
    <div className="font-sans"  >
      <div className=" md:w-96  w-full aspect-[4/3]  aspect-video bg-white rounded-2xl transition-transform transform hover:-translate-y-1 active:scale-95 hover:scale-105 flex items-center justify-center text-2xl font-bold">
        WorkCard
      </div>
      <h1 className="mt-3  text-3xl text-white font-bold ">Juan The Game</h1>
      <p className="mt-1 text-xl text-white ">Juan The Game</p>
    </div>
  );
};

export default WorkCard;