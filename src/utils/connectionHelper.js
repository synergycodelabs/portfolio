// src/utils/connectionHelper.js
import { getApiUrl } from '../config/api';

const isDevelopment = window.location.hostname === 'localhost';
const baseHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

/**
 * Check server connection status
 * @returns {Promise<Object>} Connection status and details
 */
export const checkServerConnection = async () => {
  try {
    const response = await fetch(getApiUrl('status'), {
      mode: 'cors',
      credentials: isDevelopment ? 'include' : 'omit',
      headers: baseHeaders
    });
    
    const data = await response.json();
    return { status: 'online', secure: true, error: null };
  } catch (error) {
    console.error('Status check failed:', error);
    return { status: 'offline', secure: false, error: error.message };
  }
};

/**
 * Send chat message to server
 * @param {string} message - User message
 * @param {Array} context - Previous conversation context
 * @returns {Promise<Object>} Server response
 */
export const sendChatMessage = async (message, context = []) => {
  try {
    const response = await fetch(getApiUrl('chat'), {
      method: 'POST',
      mode: 'cors',
      credentials: isDevelopment ? 'include' : 'omit',
      headers: baseHeaders,
      body: JSON.stringify({ 
        message,
        context: context.slice(-3)
      })
    });

    const data = await response.json();
    return { 
      success: true, 
      response: data.response || data.message, 
      error: null 
    };
  } catch (error) {
    return { 
      success: false, 
      response: null, 
      error: 'Connection failed' 
    };
  }
};