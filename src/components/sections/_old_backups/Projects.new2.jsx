import React from 'react';
import { Code2, Server, Bot, GitBranch } from 'lucide-react';
import ScrollIndicator from '../../ui/ScrollIndicator';

const Projects = ({ theme }) => {
  const projects = [
    {
      id: 1,
      title: "AI-Assisted Network Automation",
      description: "Developed Python scripts using AI pair programming to automate Cisco Meraki network configurations and monitoring tasks.",
      category: "AI Development",
      skills: ["Python", "Cisco Meraki API", "AI Tools"],
      icon: <Bot className="w-6 h-6" />,
      highlights: [
        "Automated VPN configuration deployment",
        "Created monitoring dashboards",
        "Reduced configuration time by 70%"
      ]
    },
    {
      id: 2,
      title: "Infrastructure Monitoring System",
      description: "Implemented comprehensive monitoring solution using ContentCatcher and N-Able for system performance analysis.",
      category: "IT Infrastructure",
      skills: ["N-Able", "ContentCatcher", "PowerShell"],
      icon: <Server className="w-6 h-6" />,
      highlights: [
        "Real-time system monitoring",
        "Automated alert system",
        "Performance metrics dashboard"
      ]
    },
    {
      id: 3,
      title: "EDI Data Processing Automation",
      description: "Developed automation scripts for processing EDI data transactions in direct mail marketing orders.",
      category: "Development",
      skills: ["Python", "SQL", "EDI"],
      icon: <Code2 className="w-6 h-6" />,
      highlights: [
        "Automated data validation",
        "Streamlined order processing",
        "Reduced processing errors by 90%"
      ]
    },
    {
      id: 4,
      title: "Version Control Implementation",
      description: "Set up and managed version control system for automation scripts and documentation.",
      category: "DevOps",
      skills: ["Git", "GitHub", "Documentation"],
      icon: <GitBranch className="w-6 h-6" />,
      highlights: [
        "Established Git workflows",
        "Created documentation system",
        "Improved team collaboration"
      ]
    }
  ];

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 dark:text-white">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                  {project.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold dark:text-white">{project.title}</h3>
                  <span className="text-sm text-blue-600 dark:text-blue-400">{project.category}</span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded-full text-sm dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                {project.highlights.map((highlight, index) => (
                  <li key={index} className="mb-1">{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Added ScrollIndicator */}
        <ScrollIndicator targetSection="contact" />
      </div>
    </section>
  );
};

export default Projects;