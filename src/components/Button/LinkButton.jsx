import React from "react";

const LinkButton = ({ children, onClick, href, className, color= "zinc" }) => {
  const baseClasses = `inline-block px-8 py-2 rounded-3xl rounded-bl-none cursor-pointer text-white bg-${color}-900 transition-all hover:bg-gray-dark hover:text-white text-xl active:scale-95 active:bg-${color}-600 duration-200`;
  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${className}`} data-cursor-text="Visit Link">
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`} data-cursor-text="Click">
      {children}
    </button>
  );
};

export default LinkButton;