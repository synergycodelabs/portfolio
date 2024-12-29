import React, { useEffect } from 'react';
import SEO from '../../common/SEO';
import NavigationIndicator from '../../ui/NavigationIndicator';

// Child components
import ProfessionalNetworksCard from './ProfessionalNetworksCard';
import ContactForm from './ContactForm';

const ContactInner = ({ theme }) => {
  const contactInfo = {
    linkedin: 'https://www.linkedin.com/in/guevaraangel/',
    github: 'https://github.com/synergycodelabs',
  };

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
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
      <SEO 
        path="/contact"
        title="Contact - Angel Guevara"
        description="Get in touch with Angel Guevara for professional inquiries, collaboration, or project opportunities."
      />

      <section
        id="contact"
        className={`min-h-screen py-20 ${
          theme === 'dark'
            ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-b from-gray-50 via-white to-gray-100'
        }`}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Section Title & Description */}
          <div className="text-center mb-12 reveal">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
              Let's Connect
            </h2>
            <p
              className={`max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              I'm always interested in discussing new opportunities and innovative
              projects. Feel free to reach out through the form or connect with me on 
              professional networks. You can also chat with my AI assistant using the 
              chat button at the bottom right of any page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {/* Left Column: Professional Networks */}
            <div className="reveal">
              <ProfessionalNetworksCard theme={theme} contactInfo={contactInfo} />
            </div>

            {/* Right Column: Contact Form */}
            <div className="reveal">
              <ContactForm theme={theme} />
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <NavigationIndicator 
              previousSection="Resume" 
              showHome={true}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactInner;