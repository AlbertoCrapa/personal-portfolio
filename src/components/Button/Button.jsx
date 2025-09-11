import React from "react";

const Button = ({ children, onClick, href, className }) => {
  const baseClasses = "inline-block px-3 py-1 cursor-pointer rounded-3xl rounded-bl-none text-white bg-black px-2 py-1 transition-all hover:bg-gray-dark font-black hover:text-white text-xl active:scale-95 active:bg-gray-dark duration-200";
  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${className}`} data-cursor-text="Visit Link" data-cursor-color="#FFC15D">
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`} data-cursor-text="Click" data-cursor-color="#FFC15D">
      {children}
    </button>
  );
};

export default Button;