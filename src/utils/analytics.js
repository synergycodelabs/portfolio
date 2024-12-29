// src/utils/analytics.js

export const trackDownload = (documentType) => {
    // Basic tracking function - can be expanded to use any analytics service
    try {
      // If you're using Google Analytics
      if (window.gtag) {
        window.gtag('event', 'download', {
          'event_category': 'resume',
          'event_label': documentType,
          'value': 1
        });
      }
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Download tracked: ${documentType}`);
      }
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };