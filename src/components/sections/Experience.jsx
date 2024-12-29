import React, { useEffect } from 'react';
import { 
  Bot, Network, Database, Shield, 
  Users, BrainCircuit, LineChart, Target
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import NavigationIndicator from '../ui/NavigationIndicator';
import SEO from '../common/SEO';

const Experience = ({ theme }) => {
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

  // Featured projects/achievements organized by key areas
  const achievements = {
    aiDevelopment: {
      title: "AI & Automation Innovation",
      icon: <Bot className="h-6 w-6 text-blue-500" />,
      highlights: [
        {
          title: "Custom AI Chatbot Development",
          impact: "40% reduction in routine support queries",
          details: [
            "Designed and implemented AI-powered chatbots for business process automation",
            "Integrated multiple AI platforms (Claude, ChatGPT, Gemini) for enhanced capabilities",
            "Created sophisticated prompt engineering strategies for optimal AI interactions"
          ]
        },
        {
          title: "Workflow Automation Suite",
          impact: "60% faster task completion times",
          details: [
            "Developed Python and PowerShell scripts for automated system management",
            "Implemented AI-assisted code generation for rapid development",
            "Created self-documenting automation workflows"
          ]
        }
      ]
    },
    networkInfrastructure: {
      title: "Network & Infrastructure Management",
      icon: <Network className="h-6 w-6 text-blue-500" />,
      highlights: [
        {
          title: "Cisco Meraki Implementation",
          impact: "99.9% network uptime achieved",
          details: [
            "Led complete network infrastructure upgrade using Cisco Meraki",
            "Implemented secure VPN access for remote workforce",
            "Designed redundant network architecture for high availability"
          ]
        },
        {
          title: "Security Enhancement Project",
          impact: "Zero security incidents post-implementation",
          details: [
            "Deployed comprehensive security protocols across network infrastructure",
            "Implemented multi-layer security measures for data protection",
            "Conducted regular security audits and vulnerability assessments"
          ]
        }
      ]
    },
    systemIntegration: {
      title: "System Integration & Database Management",
      icon: <Database className="h-6 w-6 text-blue-500" />,
      highlights: [
        {
          title: "Direct Mail EDI System Enhancement",
          impact: "70% faster order processing",
          details: [
            "Modernized EDI systems for direct mail marketing customer orders",
            "Implemented automated validation for purchase orders and shipping notices",
            "Streamlined order processing workflow with error handling"
          ]
        },
        {
          title: "Database Performance Optimization",
          impact: "85% reduction in query times",
          details: [
            "Redesigned database architecture for improved performance",
            "Implemented caching strategies for frequently accessed data",
            "Created automated backup and recovery procedures"
          ]
        }
      ]
    },
    technicalLeadership: {
      title: "Technical Leadership & Team Development",
      icon: <Users className="h-6 w-6 text-blue-500" />,
      highlights: [
        {
          title: "Support Team Transformation",
          impact: "95% customer satisfaction rate",
          details: [
            "Led and mentored technical support team of 5+ members",
            "Implemented new ticket management system and procedures",
            "Developed comprehensive training materials and documentation"
          ]
        },
        {
          title: "Process Improvement Initiative",
          impact: "30% reduction in resolution time",
          details: [
            "Streamlined support processes and procedures",
            "Created efficient escalation pathways",
            "Implemented metrics-based performance tracking"
          ]
        }
      ]
    }
  };

  const ProjectHighlight = ({ highlight, isPreview = false }) => (
    <div className={`${isPreview ? 'mb-2' : 'mb-6'}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-semibold">{highlight.title}</h4>
        <span className={`px-3 py-1 rounded-full text-sm ${
          theme === 'dark' 
            ? 'bg-blue-900/50 text-blue-200' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {highlight.impact}
        </span>
      </div>
      {!isPreview && (
        <ul className={`space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {highlight.details.map((detail, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <>
      <SEO 
        path="/experience"
        title="Experience - Angel Guevara | IT Professional"
        description="Explore key achievements and innovations in AI development, infrastructure management, and technical leadership."
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
              Professional Achievements
            </h2>
            <p className={`max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Highlighting key projects, innovations, and measurable impacts across different
              areas of expertise.
            </p>
          </div>

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 reveal opacity-0">
            {[
              {
                icon: <Target className="h-6 w-6" />,
                label: "Projects Delivered",
                value: "50+"
              },
              {
                icon: <BrainCircuit className="h-6 w-6" />,
                label: "AI Solutions Implemented",
                value: "15+"
              },
              {
                icon: <LineChart className="h-6 w-6" />,
                label: "Efficiency Improvement",
                value: "40%"
              }
            ].map((metric, index) => (
              <Card key={index} className={`transform hover:scale-105 transition-all duration-300 ${
                theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
              }`}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
                  }`}>
                    {metric.icon}
                  </div>
                  <div>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Achievement Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal opacity-0">
            {Object.entries(achievements).map(([key, category]) => (
              <Card key={key} className={`${
                theme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              } hover:shadow-lg transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
                    }`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold">{category.title}</h3>
                  </div>
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.highlights.map((highlight, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`${key}-${index}`}
                        className={`border rounded-lg ${
                          theme === 'dark' 
                            ? 'border-gray-700' 
                            : 'border-gray-200'
                        }`}
                      >
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <ProjectHighlight highlight={highlight} isPreview={true} />
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className={`mt-4 p-4 rounded-lg ${
                            theme === 'dark' 
                              ? 'bg-gray-700/50' 
                              : 'bg-gray-50'
                          }`}>
                            <ProjectHighlight highlight={highlight} isPreview={false} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-12">
            <NavigationIndicator
              previousSection="about"
              targetSection="skills"
              showHome={true}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Experience;