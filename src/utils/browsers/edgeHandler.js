// src/utils/browsers/edgeHandler.js
import { getApiUrl } from '../../config/api';

const isDevelopment = window.location.hostname === 'localhost';

export const edgeHandler = {
  checkStatus: async () => {
    try {
      const response = await fetch(getApiUrl('status'), {
        mode: 'cors',
        credentials: isDevelopment ? 'include' : 'omit',
        headers: {
          'Accept': 'application/json',
          'Origin': window.location.origin
        }
      });
      
      const data = await response.json();
      return { status: 'online', secure: true, error: null };
    } catch (error) {
      console.error('Edge status check failed:', error);
      return { status: 'offline', secure: false, error: error.message };
    }
  },

  sendMessage: async (message) => {
    try {
      const response = await fetch(getApiUrl('chat'), {
        method: 'POST',
        mode: 'cors',
        credentials: isDevelopment ? 'include' : 'omit',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      return { success: true, response: data.response || data.message, error: null };
    } catch (error) {
      return { success: false, response: null, error: 'Edge connection failed' };
    }
  }
};