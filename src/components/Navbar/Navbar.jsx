import React from "react";
import { Link } from "react-router-dom";
import FloatingSocialPanel from "../FloatingSocialPanel/FloatingSocialPanel";

const Navbar = ({ cont }) => (
  <nav className="mx-[calc(var(--spacing)/2+16px)] w-fit ml-auto pl-auto min-[390px]:space-x-4 space-x-1 sm:py-4 py-4 mt-2 sm:block hidden flex justify-end ">
    {/* <FloatingSocialPanel contact={cont} /> */}
    {/* <NavLinkButton href="#about">About</NavLinkButton> */}
    <NavLinkButton href="#projects">Projects</NavLinkButton>
    <NavLinkButton href="/blog">Blog</NavLinkButton>
    <NavLinkButton href="#contact">Contact</NavLinkButton>
  </nav>
);




const NavLinkButton = ({ href, children }) => (
  <a
    href={href}

    className="text-black serif bg-white rounded-2xl rounded-bl-none active:bg-black  px-4 py-1.5 transition-all hover:bg-black active:bg-graay-dark  font-bold hover:text-white text-xl duration-200 active:scale-95 "
  >
    {children}
  </a>
);

export default Navbar;