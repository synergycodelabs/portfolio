// src/config/api.js
const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    return 'https://api.synergycodelabs.com:48763';
  }
  return 'http://localhost:3002';
};

export const getApiUrl = (endpoint) => {
  const baseUrl = getBaseUrl();
  const endpoints = {
    status: '/api/status',
    chat: '/api/chat'
  };
  const url = `${baseUrl}${endpoints[endpoint]}`;
  
  // Only log in development
  if (import.meta.env.DEV) {
    console.log('API URL:', url);
  }
  
  return url;
};

export default {
  baseUrl: getBaseUrl(),
  endpoints: {
    status: '/api/status',
    chat: '/api/chat'
  }
};