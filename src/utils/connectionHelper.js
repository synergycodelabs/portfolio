// src/utils/connectionHelper.js
import { getApiUrl } from '@/config/api';

const proxyFetch = async (url, options = {}) => {
  // Base fetch configuration
  const fetchOptions = {
    ...options,
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': window.location.origin,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, fetchOptions);
    console.log('Response details:', {
      ok: response.ok,
      status: response.status,
      headers: Object.fromEntries([...response.headers])
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    console.error('Request failed:', {
      url,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

export const checkServerConnection = async () => {
  try {
    const url = getApiUrl('status');
    const data = await proxyFetch(url);
    return { status: 'online', secure: true, error: null };
  } catch (error) {
    return { status: 'offline', secure: false, error: error.message };
  }
};

export const sendChatMessage = async (message) => {
  try {
    const url = getApiUrl('chat');
    const data = await proxyFetch(url, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
    
    return {
      success: true,
      response: data.response || data.message,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      response: null,
      error: 'Connection failed. Please try again.'
    };
  }
};