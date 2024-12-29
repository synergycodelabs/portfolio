import React from 'react';
import { UserCircle, Binary, Brain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ScrollIndicator from '../../ui/ScrollIndicator';

const About = ({ theme }) => {
  return (
    <section id="about" className="py-20 px-4 min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto flex-grow">
        <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left column - Main content */}
          <div className="space-y-6">
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Versatile IT specialist with over 10 years of experience in technical support,
              system administration, and application management. My journey in technology
              has evolved from traditional IT support to embracing modern development practices
              and AI-assisted solutions.
            </p>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              As a bilingual professional fluent in English and Spanish, I've successfully
              bridged communication gaps in diverse technical environments and helped teams
              achieve their goals through effective problem-solving and innovation.
            </p>
          </div>

          {/* Right column - Key aspects */}
          <div className="space-y-4">
            <Card className={theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'}>
              <CardContent className="p-4 flex items-start space-x-4">
                <UserCircle className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Professional Growth</h3>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    Continuously expanding skills in application support, incident management,
                    and modern development practices.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'}>
              <CardContent className="p-4 flex items-start space-x-4">
                <Binary className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Technical Expertise</h3>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    Proficient in various databases, web applications, and leveraging AI tools
                    for efficient problem-solving.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'}>
              <CardContent className="p-4 flex items-start space-x-4">
                <Brain className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">AI Integration</h3>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    Embracing AI-assisted development to enhance productivity and create
                    innovative solutions for complex technical challenges.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator targetSection="experience" />
    </section>
  );
};

export default About;