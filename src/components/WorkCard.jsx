import React from "react";
import { motion } from "framer-motion";



const WorkCard = ({id}) => {

  return (
    <div className="font-sans works_element md:w-2/5  w-full  "  >
      <div className=" btn-primary w-full aspect-[4/3]  aspect-video bg-white rounded-2xl  flex items-center justify-center text-2xl font-bold  ">
        WorkCard
      </div>
      <h1 className="mt-3  text-3xl text-white font-bold ">Juan The Game</h1>
      <p className="mt-1 text-xl text-white ">Juan The Game</p>
    </div>
  );
};

export default WorkCard;