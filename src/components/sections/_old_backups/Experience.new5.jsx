import React from 'react';
import { Accordion } from '../../ui/accordion';
import AvailabilityBanner from '../experience/AvailabilityBanner';
import ExperienceItem from '../experience/ExperienceItem';
import { experienceData } from '../experience/experienceData';
import ScrollIndicator from '../../ui/ScrollIndicator';

const Experience = ({ theme }) => {
  // Previous code remains the same
  return (
    <section id="experience" className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} relative`}>
      {/* Previous content remains the same */}
      <ScrollIndicator targetSection="skills" /> {/* Changed from 'projects' to 'skills' */}
    </section>
  );
};

export default Experience;