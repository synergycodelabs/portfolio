// File: src/components/sections/Contact.jsx

import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import ContactInner from './contact/ContactInner';

const Contact = ({ theme = 'dark' }) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6Ldoe6QqAAAAAI49NBAidae3hZ9CMqGKbb98ZZa4" // <-- Your v3 site key
      scriptProps={{
        async: true,
        defer: true,
      }}
    >
      <ContactInner theme={theme} />
    </GoogleReCaptchaProvider>
  );
};

export default Contact;
