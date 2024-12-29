// File: src/components/sections/contact/ContactForm.jsx

import React, { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Card, CardContent } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { Button } from '../../ui/button';
import { CheckCircle, AlertCircle, Send } from 'lucide-react';

const ContactForm = ({ theme }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: null,
    loading: false,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '', // Honeypot field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitted: false, error: null, loading: true });

    if (!executeRecaptcha) {
      setFormStatus({
        submitted: false,
        error: 'reCAPTCHA not ready',
        loading: false,
      });
      return;
    }

    try {
      const token = await executeRecaptcha('contact_form_submit');
      const data = {
        ...formData,
        'g-recaptcha-response': token,
      };
      delete data.website;

      const response = await fetch('https://formspree.io/f/xdkkknzd', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      setFormStatus({ submitted: true, error: null, loading: false });
      setFormData({ name: '', email: '', message: '', website: '' });
    } catch (error) {
      setFormStatus({
        submitted: false,
        error: error.message,
        loading: false,
      });
    }
  };

  const inputClasses = `
    w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${theme === 'dark'
      ? 'bg-gray-700/50 border-gray-600 text-white hover:bg-gray-700 focus:bg-gray-700'
      : 'bg-white/50 border-gray-300 text-gray-900 hover:bg-white hover:border-gray-400 focus:bg-white'
    }
    transition-all duration-300
  `;

  const labelClasses = `
    block text-sm font-medium mb-2
    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
  `;

  return (
    <Card
      className={`transform hover:scale-105 transition-all duration-300 h-full ${
        theme === 'dark'
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-white/50 border-gray-200'
      }`}
    >
      <CardContent className="p-4 h-full">
        <h3 className="text-2xl font-semibold mb-4">Send a Message</h3>
  
        {formStatus.submitted ? (
          <div className={`flex flex-col items-center justify-center py-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'
          }`}>
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Message Sent!</h4>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Thank you for reaching out. I'll get back to you soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot Field */}
            <div className="hidden">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                tabIndex="-1"
                autoComplete="off"
              />
            </div>
  
            {/* Name Field */}
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
            } transition-colors`}>
              <label htmlFor="name" className={labelClasses}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
  
            {/* Email Field */}
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
            } transition-colors`}>
              <label htmlFor="email" className={labelClasses}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
  
            {/* Message Field */}
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
            } transition-colors`}>
              <label htmlFor="message" className={labelClasses}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className={inputClasses}
                required
              />
            </div>
  
            {/* Error Alert */}
            {formStatus.error && (
              <Alert className={`${
                theme === 'dark' 
                  ? 'bg-red-900/50 border-red-800' 
                  : 'bg-red-100 border-red-200'
              }`}>
                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                <AlertDescription className={
                  theme === 'dark' ? 'text-red-300' : 'text-red-700'
                }>
                  {formStatus.error}
                </AlertDescription>
              </Alert>
            )}
  
            {/* Submit Button */}
            <div className={`rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
            } transition-colors`}>
              <Button
                type="submit"
                disabled={formStatus.loading}
                className="w-full flex items-center justify-center gap-2 py-2 text-lg 
                  hover:scale-[1.02] transition-transform duration-300"
              >
                {formStatus.loading ? (
                  'Sending...'
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactForm;