import React from "react";

const SocialIcon = ({ platform, url, className = "" }) => {
  const getIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'email':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        );
      case 'cv':
      case 'download':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
    }
  };

  const getPlatformColors = (platform) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return {
          base: 'text-gray-300 hover:text-white',
          glow: 'hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
        };
      case 'linkedin':
        return {
          base: 'text-blue-300 hover:text-blue-400',
          glow: 'hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]'
        };
      case 'email':
        return {
          base: 'text-red-300 hover:text-red-400',
          glow: 'hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]'
        };
      case 'cv':
        return {
          base: 'text-green-300 hover:text-green-400 mr-1',
          glow: 'hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]'
        };
        
      case 'download':
        return {
          base: 'text-green-300 hover:text-green-400',
          glow: 'hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]'
        };
      default:
        return {
          base: 'text-gray-300 hover:text-white ',
          glow: 'hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
        };
    }
  };

  const handleClick = () => {
    if (url) {
      if (platform.toLowerCase() === 'email') {
        window.location.href = `mailto:${url}`;
      } else if (platform.toLowerCase() === 'cv' || platform.toLowerCase() === 'download') {
        // Create a temporary link to download the CV
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Alberto_Crapanzano_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const colors = getPlatformColors(platform);
  const isCV = platform.toLowerCase() === 'cv' || platform.toLowerCase() === 'download';

  return (
    <button
      onClick={handleClick}
      className={`p-3 ${colors.base} transition-all duration-300 hover:scale-110 ${colors.glow} cursor-pointer ${className} ${isCV ? 'flex items-center gap-2' : ''}`}
      aria-label={isCV ? 'Download CV' : `Visit ${platform}`}
    >
      {getIcon(platform)}
      {isCV && (
        <span className="text-sm font-medium whitespace-nowrap">
          Resume
        </span>
      )}
    </button>
  );
};

export default SocialIcon;
