import React, { useState } from 'react';
import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Experience = ({ theme }) => {
  const [expandedJob, setExpandedJob] = useState(null);

  const jobs = [
    {
      id: 1,
      title: "IT Support Lead / Systems Coordinator",
      company: "Federal Direct",
      location: "Little Falls, New Jersey",
      period: "February 2023 - July 2024",
      highlights: [
        "Led IT support efforts for 60+ employees, serving as primary point of contact for technical issues",
        "Worked with Cisco Meraki networking solutions, including configuration and maintenance",
        "Managed incidents using Zendesk, ensuring timely resolution and root cause analysis",
        "Utilized monitoring tools like ContentCatcher and N-Able for system performance",
        "Worked with Access and MSSQL databases to troubleshoot data-related issues",
        "Utilized AI tools for Python, Bash, PowerShell, and VBA scripting automation",
      ]
    },
    {
      id: 2,
      title: "Technical Support Lead / Systems Administrator",
      company: "Quercus Technologies",
      location: "Lyndhurst, New Jersey",
      period: "May 2016 - December 2022",
      highlights: [
        "Served as sole IT support professional for US office, managing all technical operations",
        "Provided advanced technical support for complex client issues",
        "Managed software updates and hardware integration",
        "Documented projects using Trello and Jira for enhanced collaboration",
        "Generated training content for internal and external clients",
        "Implemented various networking protocols and managed infrastructure"
      ]
    },
    {
      id: 3,
      title: "Technical Support Specialist Level II",
      company: "Earthcam",
      location: "Hackensack, New Jersey",
      period: "August 2012 - August 2015",
      highlights: [
        "Managed Level 1 and client escalation tickets",
        "Configured client local area networks and webcam systems",
        "Set up port forwarding rules and network components",
        "Verified system configurations for image transfer and streaming",
        "Configured complex network setups including wireless radios",
        "Managed solar-powered webcam installations"
      ]
    }
  ];

  const toggleJob = (id) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  return (
    <section id="experience" className={`py-20 px-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Professional Experience</h2>
        
        <div className="space-y-6">
          {jobs.map((job) => (
            <Card 
              key={job.id}
              className={`${theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'} 
                         transition-all duration-200 hover:shadow-lg`}
            >
              <CardContent className="p-6">
                <div 
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => toggleJob(job.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-blue-500" />
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                    </div>
                    <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {job.company} - {job.location}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {job.period}
                    </p>
                  </div>
                  <button 
                    className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    aria-label={expandedJob === job.id ? "Collapse details" : "Expand details"}
                  >
                    {expandedJob === job.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {expandedJob === job.id && (
                  <div className="mt-4 pl-8">
                    <ul className={`list-disc space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {job.highlights.map((highlight, index) => (
                        <li key={index} className="ml-4">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;