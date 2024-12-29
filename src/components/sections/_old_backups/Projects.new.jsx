import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Github, Link } from 'lucide-react';
import ScrollIndicator from '../../ui/ScrollIndicator';

const Projects = ({ theme }) => {
  const projects = [
    // Your existing projects array
  ];

  return (
    <section id="projects" className={`py-20 ${theme === 'dark' ? '' : 'bg-gray-100'} relative`}>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {projects.map((project) => (
            // Your existing project cards
          ))}
        </div>
        {/* Added ScrollIndicator */}
        <div className="mt-12">
          <ScrollIndicator targetSection="contact" />
        </div>
      </div>
    </section>
  );
};

export default Projects;