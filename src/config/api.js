const apiConfig = {
  baseUrl: import.meta.env.PROD
    ? 'https://api.synergycodelabs.com:8444'
    : 'http://localhost:3002',
  endpoints: {
    status: '/api/status',
    chat: '/api/chat'
  }
};

export const getApiUrl = (endpoint) => {
  return `${apiConfig.baseUrl}${apiConfig.endpoints[endpoint]}`;
};

export default apiConfig;