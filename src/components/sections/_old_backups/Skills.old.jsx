import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Code2, Database, Network, Monitor, 
  Shield, Tool, Cloud, Terminal 
} from 'lucide-react';

const Skills = ({ theme }) => {
  const skillCategories = [
    {
      title: "Programming & Web Technologies",
      icon: <Code2 className="h-6 w-6 text-blue-500" />,
      skills: [
        { name: "Python", level: 85 },
        { name: "JavaScript", level: 80 },
        { name: "Node.js", level: 75 },
        { name: "HTML/CSS", level: 85 },
        { name: "React", level: 70 },
        { name: "Flask", level: 75 },
        { name: "FastAPI", level: 70 },
        { name: "Bash", level: 80 },
        { name: "VBA (Excel)", level: 85 }
      ]
    },
    {
      title: "Databases & Data Management",
      icon: <Database className="h-6 w-6 text-blue-500" />,
      skills: [
        { name: "MSSQL", level: 85 },
        { name: "MS Access", level: 90 },
        { name: "PostgreSQL", level: 75 },
        { name: "MongoDB", level: 70 },
        { name: "EDI Transactions", level: 85 }
      ]
    },
    {
      title: "Networking & Security",
      icon: <Network className="h-6 w-6 text-blue-500" />,
      skills: [
        { name: "TCP/IP", level: 90 },
        { name: "DNS", level: 85 },
        { name: "Firewalls", level: 85 },
        { name: "VPN", level: 80 },
        { name: "Cisco Meraki", level: 85 }
      ]
    },
    {
      title: "System Administration",
      icon: <Monitor className="h-6 w-6 text-blue-500" />,
      skills: [
        { name: "Windows Server", level: 90 },
        { name: "Linux (Ubuntu)", level: 80 },
        { name: "VMware", level: 85 },
        { name: "Hyper-V", level: 80 },
        { name: "Active Directory", level: 85 }
      ]
    }
  ];

  const certifications = [
    {
      name: "CompTIA A+",
      status: "Completed",
      icon: <Shield className="h-5 w-5 text-green-500" />
    },
    {
      name: "CompTIA Network+",
      status: "Completed",
      icon: <Shield className="h-5 w-5 text-green-500" />
    }
  ];

  const tools = [
    "Microsoft Office Suite",
    "Microsoft Deployment Toolkit",
    "Retail Pro",
    "QuickBooks POS",
    "Postman",
    "Docker",
    "Zendesk",
    "Jira",
    "Trello",
    "ContentCatcher",
    "N-Able",
    "LogMeIn",
    "TeamViewer"
  ];

  const renderSkillBar = (level) => (
    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
      <div 
        className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${level}%` }}
      />
    </div>
  );

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Skills & Expertise</h2>

        {/* Certifications */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Certifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <Card key={index} className={theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {cert.icon}
                    <span className="font-medium">{cert.name}</span>
                  </div>
                  <span className="text-green-500 text-sm">{cert.status}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {skillCategories.map((category, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {category.icon}
                {category.title}
              </h3>
              <Card className={theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex}>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {skill.name}
                          </span>
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {skill.level}%
                          </span>
                        </div>
                        {renderSkillBar(skill.level)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Tools & Software */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Tool className="h-5 w-5 text-blue-500" />
            Tools & Software
          </h3>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 border border-gray-700'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;