// src/components/FloatingChatBot/SectionIndicator.jsx
import React from 'react';

const SectionIndicator = ({ section, theme }) => {
  if (!section) return null;

  return (
    <div
      className={`text-xs ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      } mb-1 font-medium`}
    >
      <span className="inline-flex items-center gap-1">
        <span>📍</span>
        <span>{section}</span>
      </span>
    </div>
  );
};

export default SectionIndicator;