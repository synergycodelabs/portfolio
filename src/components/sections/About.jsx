import React, { useEffect } from 'react';
import { Code, Network, Brain, GraduationCap, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import NavigationIndicator from '../ui/NavigationIndicator';

// 1) Import the SEO component
import SEO from '../common/SEO';

const About = ({ theme }) => {
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

  const skills = [
    { name: "Development", icon: <Code className="h-6 w-6 text-blue-500" />, desc: "Proficient in modern development practices and AI-assisted solutions" },
    { name: "Systems", icon: <Network className="h-6 w-6 text-blue-500" />, desc: "Expert in system administration and infrastructure management" },
    { name: "Innovation", icon: <Brain className="h-6 w-6 text-blue-500" />, desc: "Leveraging AI and automation for efficient problem-solving" }
  ];

  const education = [
    {
      title: "Network & Systems",
      skills: ["Network Administration", "Infrastructure Management", "Systems Diagnostics"]
    },
    {
      title: "Development",
      skills: ["Programming Fundamentals", "Data Communications", "Technical Documentation"]
    }
  ];

  return (
    <>
      {/* 2) Place the SEO component here, at the top level of your return */}
      <SEO
        path="/about"
        title="About - Angel Guevara | IT Professional"
        description="Learn about my journey in IT, expertise in system administration, and passion for modern development practices."
      />

      <section id="about" className="min-h-screen flex flex-col">
        <div 
          className={`flex-1 ${
            theme === 'dark' 
              ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' 
              : 'bg-gradient-to-b from-gray-50 via-white to-gray-100'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 py-20">
            {/* Header */}
            <div className="text-center reveal opacity-0 mb-16">
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                About Me
              </h2>
              <div className="relative max-w-3xl mx-auto">
                <div 
                  className={`absolute inset-0 blur-lg opacity-30 ${
                    theme === 'dark' ? 'bg-blue-500' : 'bg-blue-200'
                  }`} 
                />
                <p 
                  className={`relative text-lg leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Versatile IT specialist with extensive experience in technical support, 
                  system administration, and application management. My journey in technology 
                  has evolved from traditional IT support to embracing modern development 
                  practices and AI-assisted solutions.
                </p>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {skills.map((skill, index) => (
                <div 
                  key={index}
                  className="reveal opacity-0 transform transition-all duration-500"
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <Card 
                    className={`h-full group hover:scale-105 transition-all duration-300 ${
                      theme === 'dark' 
                        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' 
                        : 'bg-white/50 border-gray-200 hover:bg-white'
                    } hover:shadow-xl hover:border-blue-500`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div 
                          className={`p-3 rounded-xl mr-4 transition-colors ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
                          } group-hover:bg-blue-500/20`}
                        >
                          {skill.icon}
                        </div>
                        <h3 className="text-xl font-semibold">{skill.name}</h3>
                      </div>
                      <p 
                        className={`${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {skill.desc}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Education Section */}
            <div className="reveal opacity-0">
              <div className="flex justify-center items-center space-x-4 mb-8">
                <div 
                  className={`p-3 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
                  }`}
                >
                  <GraduationCap className="h-8 w-8 text-blue-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold">Associate of Applied Science</h3>
                  <p className="text-blue-500 text-lg">Computer Systems Technology</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                {education.map((category, index) => (
                  <Card
                    key={index}
                    className={`transform hover:scale-105 transition-all duration-300 ${
                      theme === 'dark' 
                        ? 'bg-gray-800/50 border-gray-700' 
                        : 'bg-white/50 border-gray-200'
                    } hover:shadow-xl`}
                  >
                    <CardContent className="p-6">
                      <h4 className="text-xl font-semibold mb-4 flex items-center">
                        <ChevronRight className="h-5 w-5 text-blue-500 mr-2" />
                        {category.title}
                      </h4>
                      <ul className="space-y-3">
                        {category.skills.map((skill, skillIndex) => (
                          <li 
                            key={skillIndex}
                            className={`flex items-center ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}
                          >
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-3" />
                            <span className="text-base">{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Scroll Indicator moved up and centered */}
              <div className="flex justify-center pb-8">
                <NavigationIndicator previousSection="home" targetSection="experience" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;