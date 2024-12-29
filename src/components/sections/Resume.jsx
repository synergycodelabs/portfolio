import React, { useEffect } from 'react';
import { 
  Download, Mail, MapPin, Shield, GraduationCap, 
  Briefcase, Code, Globe, Terminal
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import NavigationIndicator from '../ui/NavigationIndicator';
import SEO from '../common/SEO';

const Resume = ({ theme }) => {
  // Animation effect for fade-in
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

  const contactInfo = {
    name: "Angel Guevara",
    title: "IT Specialist & Developer",
    address: "North New Jersey/NYC Metro Area",
    email: "angel.guevara@synergycodelabs.com"
  };

  const professionalSummary = `Versatile IT specialist with 10+ years of experience in technical support, 
    system administration, and application management. Proven expertise in troubleshooting complex issues, 
    providing excellent customer service, and leveraging analytical thinking to solve technical challenges. 
    Skilled in user support, system updates, and cross-functional collaboration to enhance application 
    performance and user experience.`;

  const certifications = [
    { name: "CompTIA A+ Certification", status: "Completed" },
    { name: "CompTIA Network+ Certification", status: "Completed" }
  ];

  const education = {
    degree: "Associate of Applied Science in Computer Systems Technology",
    school: "Inter-American University",
    location: "Bayamon, PR"
  };

  const coreCompetencies = {
    technical: [
      "System Administration",
      "Network Security",
      "EDI System Management",
      "Database Management",
      "AI-Assisted Development"
    ],
    development: [
      "Python",
      "JavaScript/React",
      "PowerShell",
      "SQL",
      "Automation Scripts"
    ],
    professional: [
      "Technical Leadership",
      "Project Management",
      "Problem Solving",
      "Documentation",
      "User Training"
    ]
  };

  return (
    <>
      <SEO 
        path="/resume"
        title="Resume - Angel Guevara | IT Specialist & Developer"
        description="Professional resume showcasing expertise in IT leadership, system administration, and technical development."
      />

      <section className={`min-h-screen py-16 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-b from-gray-50 via-white to-gray-100'
      }`}>
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8 reveal opacity-0">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                {contactInfo.name}
              </h1>
              <p className={`text-lg mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {contactInfo.title}
              </p>
              <div className="mt-4 space-y-2">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {contactInfo.address}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {contactInfo.email}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={() => window.open(`${window.location.pathname === '/' ? '' : '/portfolio-showcase'}/resume.pdf`, '_blank')}
              className={`${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              } px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 
                hover:scale-105 hover:shadow-lg`}
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>

          {/* Professional Summary */}
          <Card className={`mb-8 reveal opacity-0 ${
            theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
          }`}>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Professional Summary</h2>
              <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {professionalSummary}
              </p>
            </CardContent>
          </Card>

          {/* Two Column Layout for Certifications and Education */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Certifications */}
            <Card className={`reveal opacity-0 ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Certifications
                </h2>
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{cert.name}</span>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        theme === 'dark' 
                          ? 'bg-green-900 text-green-100' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {cert.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className={`reveal opacity-0 ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  Education
                </h2>
                <div>
                  <h3 className="text-lg font-semibold">{education.degree}</h3>
                  <p className="text-blue-500">{education.school}</p>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {education.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Core Competencies */}
          <div className="mb-8 reveal opacity-0">
            <h2 className="text-2xl font-bold mb-6">Core Competencies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Technical Skills */}
              <Card className={`${
                theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
              }`}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-blue-500" />
                    Technical
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {coreCompetencies.technical.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Development Skills */}
              <Card className={`${
                theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
              }`}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-500" />
                    Development
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {coreCompetencies.development.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Professional Skills */}
              <Card className={`${
                theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
              }`}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    Professional
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {coreCompetencies.professional.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center">
            <NavigationIndicator 
              previousSection="projects" 
              targetSection="contact" 
              showHome={true}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Resume;