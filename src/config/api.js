// src/config/api.js
const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    // Use your DNS in production
    return 'https://api.synergycodelabs.com';
  }
  // Use HTTP for local development
  return 'http://localhost:3003';
};

export const getApiUrl = (endpoint) => {
  const baseUrl = getBaseUrl();
  const endpoints = {
    status: '/api/status',
    chat: '/api/chat'
  };
  const url = `${baseUrl}${endpoints[endpoint]}`;
  console.log('API URL:', url);
  return url;
};

export default {
  baseUrl: getBaseUrl(),
  endpoints: {
    status: '/api/status',
    chat: '/api/chat'
  }
};