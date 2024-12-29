import React from 'react';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '../../../components/ui/accordion';

const ExperienceItem = ({
  id,
  title,
  company,
  dateRange,
  responsibilities,
  theme
}) => {
  return (
    <AccordionItem
      value={id}
      className={`${
        theme === 'dark' ? 'bg-gray-700' : 'bg-white'
      } rounded-lg shadow-lg flex-1 flex flex-col`}
    >
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center w-full text-left">
          <div className="flex-1">
            <h3 className="text-xl font-bold dark:text-white">{title}</h3>
            <p className="text-blue-500 dark:text-blue-400">{company}</p>
          </div>
          <span className={`text-sm mt-2 sm:mt-0 sm:ml-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {dateRange}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 py-4 flex-1">
        <ul className={`list-disc list-inside space-y-2 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {responsibilities.map((responsibility, index) => (
            <li key={index} className="leading-relaxed">
              {responsibility}
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ExperienceItem;