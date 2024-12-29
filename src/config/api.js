const apiConfig = {
  baseUrl: import.meta.env.PROD
    ? 'https://api.synergycodelabs.com:8444'
    : import.meta.env.VITE_LOCAL_API
      ? 'http://192.168.1.152:3002'
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