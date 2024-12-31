export const getApiUrl = (endpoint) => {
  const baseUrl = import.meta.env.PROD
    ? 'https://api.synergycodelabs.com'
    : 'http://localhost:3003';
  const endpoints = {
    status: '/status',
    chat: '/chat'
  };
  return `${baseUrl}${endpoints[endpoint]}`;
};

export default {
  baseUrl: import.meta.env.PROD
    ? 'https://api.synergycodelabs.com'
    : 'http://localhost:3003',
  endpoints: {
    status: '/status',
    chat: '/chat'
  }
};