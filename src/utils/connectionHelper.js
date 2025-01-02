// src/utils/connectionHelper.js
import { getApiUrl } from '@/config/api';

const getBrowserInfo = () => ({
  isMobile: /iPhone|iPad|iPod|Android|Windows Phone|IEMobile/i.test(navigator.userAgent),
  isEdge: /Edg/i.test(navigator.userAgent)
});

// Simplified mobile fetch with better error handling
const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Fetch failed:', { url, error });
    throw error;
  }
};

export const checkServerConnection = async () => {
  const browserInfo = getBrowserInfo();
  console.log('Browser details:', {
    ...browserInfo,
    userAgent: navigator.userAgent
  });

  try {
    const url = getApiUrl('status');
    const data = await safeFetch(url);
    
    return {
      status: data.status || 'online',
      secure: true,
      error: null
    };
  } catch (error) {
    return {
      status: 'offline',
      secure: false,
      error: 'Connection failed'
    };
  }
};

export const sendChatMessage = async (message) => {
  try {
    const url = getApiUrl('chat');
    const data = await safeFetch(url, {
      method: 'POST',
      body: JSON.stringify({ message })
    });

    return {
      success: true,
      response: data.response || data.message || 'No response received',
      error: null
    };
  } catch (error) {
    return {
      success: false,
      response: null,
      error: 'Unable to connect. Please try again.'
    };
  }
};