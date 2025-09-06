import React from "react";
import { Link } from "react-router-dom";
import FloatingSocialPanel from "../FloatingSocialPanel/FloatingSocialPanel";

const Navbar = ({cont}) => (
  <nav className="border-b">
    <div className="container mx-auto px-4   sm:py-8 py-12 flex justify-between items-center">
      <FloatingSocialPanel contact={cont} />
      <Link to="/" className="text-2xl font-bold hover:text-blue-600 transition-colors duration-200"> </Link>
      <NavLinks  />
    </div>
  </nav>
);


const NavLinks = () => (
  
  <div className="min-[390px]:space-x-6 space-x-2 text-lg sm:block hidden">

    
  <NavLinkButton href="#about">About</NavLinkButton>
  <NavLinkButton href="#projects">Projects</NavLinkButton>
  <NavLinkButton href="/blog">Blog</NavLinkButton> 
  <NavLinkButton href="#contact">Contact</NavLinkButton>
  
  </div>
);

const NavLinkButton = ({ href, children }) => (
  <a
    href={href}
    className="text-white bg-zinc-900 px-2 py-1 transition-all hover:bg-zinc-700 hover:font-black hover:text-white  text-xl  duration-200 active:scale-95 active:bg-zinc-600"
  >
    {children}
  </a>
);

export default Navbar;