import React, { useEffect, useState } from 'react';
import { 
  Bot, Code2, Network, Database, Shield, Server,
  Laptop, Terminal, Cloud, BrainCircuit, Globe
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import NavigationIndicator from '../ui/NavigationIndicator';
import SEO from '../common/SEO';

const Skills = ({ theme }) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.style.opacity = '1';
        }
      });
    });

    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('animate-fade-in');
      el.style.opacity = '0';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [theme]);

  const technicalDomains = {
    aiAndAutomation: {
      title: "AI & Automation Engineering",
      icon: <Bot className="h-6 w-6 text-blue-500" />,
      description: "Specialized in leveraging AI for development and automation",
      expertise: [
        {
          area: "AI Integration",
          details: "Expert in integrating various AI platforms (Claude, ChatGPT, Gemini) into development workflows",
          technologies: ["Claude API", "OpenAI API", "Google AI", "Custom Chatbots"],
          useCase: {
            title: "Automated Code Review System",
            description: "Developed an AI-powered code review system that automatically checks code quality, suggests improvements, and ensures compliance with best practices.",
            impact: "Reduced code review time by 60%"
          }
        },
        {
          area: "Process Automation",
          details: "Creating efficient automation solutions using AI-assisted development",
          technologies: ["Python", "PowerShell", "Bash", "Task Scheduling"],
          useCase: {
            title: "Workflow Automation Suite",
            description: "Built a comprehensive automation system for routine IT tasks, integrating AI for intelligent decision-making and error handling.",
            impact: "Automated 75% of routine tasks"
          }
        }
      ]
    },
    infrastructureManagement: {
      title: "Infrastructure & Networking",
      icon: <Network className="h-6 w-6 text-blue-500" />,
      description: "Expert in designing and maintaining secure network infrastructure",
      expertise: [
        {
          area: "Network Architecture",
          details: "Designing and implementing enterprise-level network solutions",
          technologies: ["Cisco Meraki", "VPN", "Firewalls", "TCP/IP"],
          useCase: {
            title: "Enterprise Network Upgrade",
            description: "Led complete network infrastructure upgrade using Cisco Meraki, implementing advanced security features and optimizing performance.",
            impact: "99.9% network uptime achieved"
          }
        },
        {
          area: "Security Implementation",
          details: "Implementing comprehensive security measures across infrastructure",
          technologies: ["Network Security", "Access Control", "Security Protocols"],
          useCase: {
            title: "Zero-Trust Architecture",
            description: "Implemented zero-trust security architecture with advanced access controls and monitoring.",
            impact: "Zero security breaches post-implementation"
          }
        }
      ]
    },
    systemsAndDatabases: {
      title: "Systems & Database Administration",
      icon: <Database className="h-6 w-6 text-blue-500" />,
      description: "Expertise in managing and optimizing database systems",
      expertise: [
        {
          area: "Database Management",
          details: "Optimizing database performance and ensuring data integrity",
          technologies: ["MSSQL", "MS Access", "PostgreSQL", "MongoDB"],
          useCase: {
            title: "Database Performance Optimization",
            description: "Redesigned database architecture and implemented advanced caching strategies for improved performance.",
            impact: "85% faster query response times"
          }
        },
        {
          area: "System Integration",
          details: "Managing EDI systems for direct mail marketing operations",
          technologies: ["EDI Transaction Sets", "Data Validation", "Order Processing"],
          useCase: {
            title: "Direct Mail EDI System Enhancement",
            description: "Modernized EDI systems for processing customer orders in direct mail marketing, implementing automated validation for purchase orders, shipping notices, and invoices.",
            impact: "70% faster order processing with improved accuracy"
          }
        }
      ]
    },
    cloudAndDevTools: {
      title: "Cloud & Development Tools",
      icon: <Cloud className="h-6 w-6 text-blue-500" />,
      description: "Proficient in cloud platforms and modern development tools",
      expertise: [
        {
          area: "Cloud Services",
          details: "Managing and deploying cloud-based solutions",
          technologies: ["Microsoft 365", "Azure", "Cloud Security"],
          useCase: {
            title: "Cloud Migration Project",
            description: "Led migration of on-premise systems to cloud infrastructure, implementing best practices for security and performance.",
            impact: "40% reduction in IT infrastructure costs"
          }
        },
        {
          area: "Development Environment",
          details: "Setting up and maintaining efficient development environments",
          technologies: ["VS Code", "Git", "Docker", "CI/CD"],
          useCase: {
            title: "DevOps Implementation",
            description: "Established modern DevOps practices and tooling for development teams.",
            impact: "50% faster deployment cycles"
          }
        }
      ]
    }
  };

  const SkillCard = ({ domain, data }) => (
    <Card className={`${
      theme === 'dark' 
        ? 'bg-gray-800/50 border-gray-700' 
        : 'bg-white/50 border-gray-200'
    } hover:shadow-lg transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
          }`}>
            {data.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold">{data.title}</h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {data.description}
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {data.expertise.map((item, index) => (
            <AccordionItem
              key={index}
              value={`${domain}-${index}`}
              className={`border rounded-lg ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="text-left">
                  <h4 className="text-lg font-semibold">{item.area}</h4>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.details}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {/* Technologies */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold mb-2">Technologies</h5>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Use Case */}
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <h5 className="font-semibold mb-2">{item.useCase.title}</h5>
                  <p className={`text-sm mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {item.useCase.description}
                  </p>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                    theme === 'dark'
                      ? 'bg-blue-900/50 text-blue-200'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    Impact: {item.useCase.impact}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );

  return (
    <>
      <SEO
        path="/skills"
        title="Technical Skills - Angel Guevara"
        description="Explore my technical expertise in AI development, infrastructure management, and system administration through real-world implementations and measurable impacts."
      />

      <section className={`py-20 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-b from-gray-50 via-white to-gray-100'
      }`}>
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-12 reveal opacity-0">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
              Technical Expertise
            </h2>
            <p className={`max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Demonstrating practical applications and real-world impact across key technical domains.
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal opacity-0">
            {Object.entries(technicalDomains).map(([domain, data]) => (
              <SkillCard key={domain} domain={domain} data={data} />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-12">
            <NavigationIndicator
              previousSection="experience"
              targetSection="projects"
              showHome={true}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Skills;