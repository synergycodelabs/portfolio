// src/config/api.js
const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    // Force HTTPS in production
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
  console.log('API URL:', url); // Add logging to help debug
  return url;
};

export default {
  baseUrl: getBaseUrl(),
  endpoints: {
    status: '/api/status',
    chat: '/api/chat'
  }
};