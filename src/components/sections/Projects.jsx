import React, { useEffect } from 'react';
import { Code2, Server, Bot, Network, Database, Monitor } from 'lucide-react';
import NavigationIndicator from '../ui/NavigationIndicator';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

// 1) Import the SEO component
import SEO from '../common/SEO';

const Projects = ({ theme }) => {
  useEffect(() => {
    // Reset animation classes
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('animate-fade-in');
      el.style.opacity = '0';
    });
  
    // Short delay to ensure reset happens
    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.style.opacity = '1';
          }
        });
      });
  
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 50);
  }, [theme]);

  const projects = [
    {
      id: 'network-mgmt',
      title: "Cisco Meraki Network Management",
      description: "Implemented and managed comprehensive network infrastructure solutions using Cisco Meraki technology.",
      category: "Network Infrastructure",
      skills: ["Cisco Meraki", "VPN", "Network Security", "AnyConnect"],
      icon: <Network className="w-6 h-6" />,
      highlights: [
        "Configured and maintained Meraki MX appliances",
        "Implemented VPN access for remote workers",
        "Managed office Wi-Fi network infrastructure",
        "Optimized network performance and security",
        "Monitored network health and usage patterns",
        "Implemented security policies and access controls"
      ]
    },
    {
      id: 'ai-automation',
      title: "AI-Assisted Automation Development",
      description: "Leveraged AI tools for efficient code development and automation across multiple programming languages.",
      category: "Development",
      skills: ["Python", "PowerShell", "Bash", "VBA", "AI Tools"],
      icon: <Bot className="w-6 h-6" />,
      highlights: [
        "Developed Python scripts for process automation",
        "Created PowerShell scripts for system management",
        "Automated data processing workflows",
        "Implemented AI-assisted code generation",
        "Enhanced development efficiency with AI tools",
        "Maintained and optimized automation scripts"
      ]
    },
    {
      id: 'database-edi',
      title: "Database Management & EDI Integration",
      description: "Managed complex database systems and EDI data transactions for direct mail marketing operations.",
      category: "Data Management",
      skills: ["MSSQL", "MS Access", "EDI", "Data Processing"],
      icon: <Database className="w-6 h-6" />,
      highlights: [
        "Handled EDI data transactions for customer orders",
        "Managed MS Access and MSSQL databases",
        "Troubleshot data-related issues",
        "Optimized data processing workflows",
        "Implemented data validation procedures",
        "Maintained data integrity and security"
      ]
    },
    {
      id: 'system-monitoring',
      title: "System Monitoring Infrastructure",
      description: "Implemented comprehensive monitoring solutions using various tools for system performance analysis.",
      category: "Infrastructure",
      skills: ["ContentCatcher", "N-Able", "System Monitoring", "Performance Analysis"],
      icon: <Monitor className="w-6 h-6" />,
      highlights: [
        "Deployed monitoring tools across systems",
        "Configured alert systems and notifications",
        "Analyzed system performance metrics",
        "Implemented proactive monitoring solutions",
        "Created performance monitoring dashboards",
        "Maintained monitoring infrastructure"
      ]
    },
    {
      id: 'helpdesk',
      title: "Help Desk System Implementation",
      description: "Set up and managed help desk systems for efficient ticket management and issue resolution.",
      category: "Support Systems",
      skills: ["Zendesk", "Jira", "Technical Documentation", "User Support"],
      icon: <Server className="w-6 h-6" />,
      highlights: [
        "Implemented ticket management systems",
        "Created technical documentation",
        "Developed support workflows",
        "Managed incident resolution processes",
        "Tracked support metrics and KPIs",
        "Improved response times and efficiency"
      ]
    },
    {
      id: 'web-support',
      title: "Web Application Support",
      description: "Provided comprehensive support for web applications and development initiatives.",
      category: "Web Development",
      skills: ["HTML", "CSS", "JavaScript", "React", "Web Apps"],
      icon: <Code2 className="w-6 h-6" />,
      highlights: [
        "Supported web application functionality",
        "Troubleshot application issues",
        "Collaborated with development teams",
        "Implemented frontend improvements",
        "Managed application updates",
        "Enhanced user experience"
      ]
    }
  ];

  const ProjectCard = ({ project }) => (
    <AccordionItem
      value={project.id}
      className={`rounded-xl border reveal opacity-0 ${
        theme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' 
          : 'bg-white border-gray-200 hover:bg-white'
      } transition-all duration-300 hover:shadow-lg`}
    >
      <AccordionTrigger className="w-full px-6 py-4 hover:no-underline">
        <div className="flex items-start w-full">
          <div className={`p-2 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
          } group-hover:bg-blue-500/10 transition-colors duration-300`}>
            {project.icon}
          </div>
          <div className="ml-4 text-left flex-1">
            <h3 className="text-lg font-semibold">{project.title}</h3>
            <span className="text-blue-500 text-xs block">{project.category}</span>
            <p className={`mt-2 text-sm min-h-[3rem] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1 mt-2 min-h-[2rem]">
              {project.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-4">
        <ul className={`list-disc list-inside space-y-1 text-sm ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {project.highlights.map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );

  const midPoint = Math.ceil(projects.length / 2);

  return (
    <>
      {/* 2) Use the SEO component at the top of the return */}
      <SEO
        path="/projects"
        title="Projects - Angel Guevara | IT Specialist & Developer"
        description="Explore completed projects showcasing my expertise in network management, automation development, database systems, and more."
      />

      <section
        id="projects"
        className={`py-20 ${
          theme === 'dark' 
            ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-b from-gray-50 via-white to-gray-100'
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700 reveal opacity-0">
            Projects & Implementations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 reveal opacity-0">
            <Accordion type="single" collapsible className="space-y-4">
              {projects.slice(0, midPoint).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </Accordion>

            <Accordion type="single" collapsible className="space-y-4">
              {projects.slice(midPoint).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </Accordion>
          </div>

          <div className="flex justify-center pb-8">
            <NavigationIndicator 
              previousSection="skills" 
              targetSection="resume" 
              showHome={true}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Projects;