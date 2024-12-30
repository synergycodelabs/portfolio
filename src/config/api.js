export const getApiUrl = (endpoint) => {
  const baseUrl = import.meta.env.PROD
    ? 'https://api.synergycodelabs.com:8443'
    : 'http://localhost:3002';
  
  const endpoints = {
    status: '/api/status',
    chat: '/api/chat'
  };
  
  return `${baseUrl}${endpoints[endpoint]}`;
};

export default {
  baseUrl: import.meta.env.PROD
    ? 'https://api.synergycodelabs.com:8443'
    : 'http://localhost:3002',
  endpoints: {
    status: '/api/status',
    chat: '/api/chat'
  }
};