import React from "react";

const LinkButton = ({ children, onClick, href, className, color= "zinc" }) => {
  const baseClasses = `inline-block px-8 py-2 cursor-pointer text-white bg-${color}-900 transition-all hover:bg-${color}-700 hover:font-black hover:text-white text-xl active:scale-95 active:bg-${color}-600 duration-200`;
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

export default LinkButton;