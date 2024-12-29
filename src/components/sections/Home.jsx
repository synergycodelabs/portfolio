import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Code, Shield, Mail, Download, Github, Linkedin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import NavigationIndicator from '../ui/NavigationIndicator';

// 1) Import your SEO component
import SEO from '../common/SEO';

const Home = ({ theme }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    });
  
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.remove('animate-fade-in'); // Reset animation
      observer.observe(el);
    });
  
    return () => observer.disconnect();
  }, [theme]);

  return (
    <>
      {/* 2) Use the SEO component at the top of the return */}
      <SEO 
        path="/" 
        title="Angel Guevara - IT Specialist & Developer Portfolio"
        description="10+ years of IT expertise combined with modern development capabilities. 
          Specializing in system administration, network security, and AI-assisted development." 
      />

      <section id="home" className="min-h-screen flex flex-col justify-between">
        {/* Hero Section */}
        <div className={`pt-20 pb-8 px-4 relative overflow-hidden ${
          theme === 'dark' 
            ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-b from-blue-50 via-white to-blue-50'
        }`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-grid-pattern transform rotate-45 scale-150" />
          </div>

          <div className="max-w-6xl mx-auto text-center relative">
            <div className="reveal opacity-0 transition-all duration-1000 delay-300">
              <Monitor className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-float" />
              <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                IT Specialist & Developer
              </h1>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed`}>
                10+ years of IT expertise combined with modern development capabilities.
                Specializing in system administration, network security, and AI-assisted development.
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-6 reveal opacity-0 transition-all duration-1000 delay-500">
              <a 
                href="https://github.com/synergycodelabs" 
                aria-label="Visit GitHub Profile"
                className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              >
                <Github className="w-6 h-6 text-blue-500" />
              </a>
              <a 
                href="https://www.linkedin.com/in/guevaraangel/"
                aria-label="Visit LinkedIn Profile"
                className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              >
                <Linkedin className="w-6 h-6 text-blue-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Core Competencies Section */}
        <section className={`py-8 px-4 flex-grow ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center reveal opacity-0 transition-all duration-1000">
              Core Competencies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: <Monitor className="h-6 w-6 text-blue-500" />,
                  title: "Technical Support",
                  desc: "Expert in troubleshooting, system administration, and user support across multiple platforms."
                },
                {
                  icon: <Code className="h-6 w-6 text-blue-500" />,
                  title: "AI Development",
                  desc: "Leveraging modern AI tools for efficient code development and problem-solving."
                },
                {
                  icon: <Shield className="h-6 w-6 text-blue-500" />,
                  title: "Network Security",
                  desc: "Proficient in implementing and maintaining secure network infrastructure and protocols."
                }
              ].map((item, index) => (
                <Card 
                  key={index}
                  className={`reveal opacity-0 transition-all duration-500 transform hover:scale-105 
                    ${theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'}
                    hover:shadow-xl hover:border-blue-500`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="mb-2">{item.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="flex justify-center gap-4 py-6 reveal opacity-0 transition-all duration-1000">
          <button
            onClick={() => navigate('/contact')}
            aria-label="Contact Me"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 
              transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Contact Me <Mail className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/resume')}
            aria-label="Download Resume"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-6 py-3 
              rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Download Resume <Download className="w-5 h-5" />
          </button>
        </div>

        <NavigationIndicator targetSection="about" />
      </section>
    </>
  );
};

export default Home;