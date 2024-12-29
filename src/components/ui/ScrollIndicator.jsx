// src/components/ui/ScrollIndicator.jsx
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScrollIndicator = ({ targetSection, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    // Map section names to their corresponding routes
    const routeMap = {
      'about': '/about',
      'experience': '/experience',
      'skills': '/skills',
      'projects': '/projects',
      'contact': '/contact',
      'resume': '/resume'
    };

    // Navigate to the corresponding route
    navigate(routeMap[targetSection]);
  };

  return (
    <div className={`flex justify-center pb-8 ${className}`}>
      <button 
        onClick={handleClick}
        className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-300"
        aria-label={`Navigate to ${targetSection} section`}
      >
        <ChevronDown className="w-8 h-8 animate-bounce" />
      </button>
    </div>
  );
};

export default ScrollIndicator;