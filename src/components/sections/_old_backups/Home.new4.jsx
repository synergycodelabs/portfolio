import React from 'react';
import { Monitor, Code, Shield, Mail, Download } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import ScrollIndicator from '../../ui/ScrollIndicator';

const Home = ({ theme }) => {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-between pt-24">
      <div className="flex-1">
        {/* Hero Section */}
        <section className="mb-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <Monitor className="w-16 h-16 mx-auto mb-6 text-blue-500" />
            <h1 className="text-5xl font-bold mb-6">IT Specialist & Developer</h1>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              10+ years of IT expertise combined with modern development capabilities.
              Specializing in system administration, network security, and AI-assisted development.
            </p>
          </div>
        </section>

        {/* Featured Skills */}
        <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Core Competencies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className={theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'}>
                <CardContent className="p-6">
                  <Monitor className="h-8 w-8 mb-4 text-blue-500" />
                  <h3 className="text-xl font-semibold mb-4">Technical Support</h3>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    Expert in troubleshooting, system administration, and user support across multiple platforms.
                  </p>
                </CardContent>
              </Card>
              <Card className={theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'}>
                <CardContent className="p-6">
                  <Code className="h-8 w-8 mb-4 text-blue-500" />
                  <h3 className="text-xl font-semibold mb-4">AI Development</h3>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    Leveraging modern AI tools for efficient code development and problem-solving.
                  </p>
                </CardContent>
              </Card>
              <Card className={theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'}>
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 mb-4 text-blue-500" />
                  <h3 className="text-xl font-semibold mb-4">Network Security</h3>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    Proficient in implementing and maintaining secure network infrastructure and protocols.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Section - Always Visible */}
      <div className="sticky bottom-0 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pt-8 pb-8">
        {/* Scroll Indicator */}
        <div className="mb-8">
          <ScrollIndicator targetSection="about" />
        </div>

        {/* Call to Action */}
        <div className="flex justify-center gap-4">
          <a
            href="#contact"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-300"
          >
            Contact Me <Mail className="w-5 h-5" />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-300"
          >
            Download Resume <Download className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;