export const getApiUrl = (endpoint) => {
  const baseUrl = import.meta.env.PROD
    ? 'https://api.synergycodelabs.com'
    : 'http://localhost:3003';

  const endpoints = {
    status: '/api/status',
    chat: '/api/chat'
  };

  return `${baseUrl}${endpoints[endpoint]}`;
};

export default {
  baseUrl: import.meta.env.PROD
    ? 'https://api.synergycodelabs.com'
    : 'http://localhost:3003',
  endpoints: {
    status: '/api/status',
    chat: '/api/chat'
  }
};