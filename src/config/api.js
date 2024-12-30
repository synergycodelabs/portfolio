const apiConfig = {
  baseUrl: import.meta.env.PROD
    ? 'https://api.synergycodelabs.com:8444/api'
    : 'http://localhost:3004/api',
  endpoints: {
    status: '/api/status',
    chat: '/api/chat'
  }
};

export const getApiUrl = (endpoint) => {
  return `${apiConfig.baseUrl}${apiConfig.endpoints[endpoint]}`;
};

export default apiConfig;