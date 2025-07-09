import React from "react";

const Button = ({ children, onClick, href, className }) => {
  const baseClasses = "inline-block px-3 py-1   cursor-pointer  text-white bg-zinc-900 px-2 py-1 transition-all hover:bg-zinc-700 hover:font-black hover:text-white text-xl active:scale-95 active:bg-zinc-600 duration-200";
  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${className}`}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
};

export default Button;