// src/components/ui/NavigationIndicator.jsx
import React from 'react';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavigationIndicator = ({ previousSection, targetSection, showHome = false }) => {
  const navigate = useNavigate();

  const handleNavigation = (section) => {
    navigate(`/${section === 'home' ? '' : section}`);
  };

  return (
    <div className="flex justify-center items-center gap-8 py-4">
      {previousSection && (
        <button 
          onClick={() => handleNavigation(previousSection)}
          className="group flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
          aria-label={`Navigate to ${previousSection} section`}
        >
          <ArrowLeft className="w-5 h-5 animate-slide-x-reverse" />
          <span className="text-sm">Previous: {previousSection.charAt(0).toUpperCase() + previousSection.slice(1)}</span>
        </button>
      )}

      {showHome && (
        <button
          onClick={() => handleNavigation('home')}
          className="p-2 rounded-full text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-300"
          aria-label="Return to Home"
        >
          <Home className="w-6 h-6" />
        </button>
      )}

      {targetSection && (
        <button 
          onClick={() => handleNavigation(targetSection)}
          className="group flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
          aria-label={`Navigate to ${targetSection} section`}
        >
          <span className="text-sm">Next: {targetSection.charAt(0).toUpperCase() + targetSection.slice(1)}</span>
          <ArrowRight className="w-5 h-5 animate-slide-x" />
        </button>
      )}
    </div>
  );
};

export default NavigationIndicator;