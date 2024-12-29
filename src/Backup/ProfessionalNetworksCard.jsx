import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Linkedin, Github, FileText, ExternalLink, Mail } from 'lucide-react';

const ProfessionalNetworksCard = ({ theme, contactInfo }) => {
  return (
    <Card
      className={`transform hover:scale-105 transition-all duration-300 h-full ${
        theme === 'dark'
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-white/50 border-gray-200'
      }`}
    >
      <CardContent className="p-4 h-full flex flex-col">
        <h3 className="text-2xl font-semibold mb-4">Professional Networks</h3>
        
        {/* Network Links Section */}
        <div className="space-y-4 flex-grow">
          {/* LinkedIn */}
          <a
            href={contactInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-4 p-3 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
            } group transition-colors`}
          >
            <div
              className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
              } group-hover:bg-blue-500/20 transition-colors`}
            >
              <Linkedin className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <span className="font-semibold block">LinkedIn</span>
              <span
                className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Professional Profile
              </span>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
          </a>

          {/* GitHub */}
          <a
            href={contactInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-4 p-3 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
            } group transition-colors`}
          >
            <div
              className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
              } group-hover:bg-blue-500/20 transition-colors`}
            >
              <Github className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <span className="font-semibold block">GitHub</span>
              <span
                className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Project Repository
              </span>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
          </a>

          {/* Resume */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-4 p-3 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
            } group transition-colors`}
          >
            <div
              className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
              } group-hover:bg-blue-500/20 transition-colors`}
            >
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <span className="font-semibold block">Resume</span>
              <span
                className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Download PDF
              </span>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
          </a>
        </div>

        {/* Email Info Section */}
        <div
          className={`p-3 rounded-lg mt-auto ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-blue-500" />
            <h4 className="font-semibold">Prefer Email?</h4>
          </div>
          <p
            className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Feel free to connect on LinkedIn or use the contact form. I typically respond within 24-48 hours.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalNetworksCard;