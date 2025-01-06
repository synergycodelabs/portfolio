// src/config/api.js
const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    // Use HTTP for now (we can add HTTPS later with SSL)
    return 'https://api.synergycodelabs.com:48763';
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
  console.log('API URL:', url); // Keep logging for debugging
  return url;
};

export default {
  baseUrl: getBaseUrl(),
  endpoints: {
    status: '/api/status',
    chat: '/api/chat'
  }
};