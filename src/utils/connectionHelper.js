// src/utils/connectionHelper.js
import { getApiUrl } from '@/config/api';

const getBrowserInfo = () => {
  const isMobile = /iPhone|iPad|iPod|Android|Windows Phone|IEMobile/i.test(navigator.userAgent);
  const isEdge = /Edg/i.test(navigator.userAgent);
  const isFirefox = /firefox/i.test(navigator.userAgent);
  return { isMobile, isEdge, isFirefox };
};

const mobileRequest = async (url, options = {}) => {
  const fetchOptions = {
    ...options,
    mode: 'cors',
    credentials: 'omit',
    headers: {
      ...options.headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Mobile request failed:', error);
    throw error;
  }
};

export const checkServerConnection = async () => {
  try {
    const { isMobile } = getBrowserInfo();
    console.log('Browser details:', { 
      ...getBrowserInfo(), 
      userAgent: navigator.userAgent 
    });

    const url = getApiUrl('status');
    console.log('Checking status at:', url);

    if (isMobile) {
      const data = await mobileRequest(url);
      return {
        status: data.status || 'online',
        secure: true,
        error: null
      };
    }

    // Desktop browsers
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      status: data.status,
      secure: data.secure,
      error: null
    };
  } catch (error) {
    console.error('Connection check failed:', error);
    return {
      status: 'offline',
      secure: false,
      error: error.message
    };
  }
};

export const sendChatMessage = async (message) => {
  try {
    const { isMobile } = getBrowserInfo();
    const url = getApiUrl('chat');
    console.log('Sending chat message to:', url);

    if (isMobile) {
      const data = await mobileRequest(url, {
        method: 'POST',
        body: JSON.stringify({ message })
      });
      
      return {
        success: true,
        response: data.response || data.message || 'No response received',
        error: null
      };
    }

    // Desktop browsers
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      response: data.response || data.message || 'No response received',
      error: null
    };
  } catch (error) {
    console.error('Chat request failed:', error);
    return {
      success: false,
      response: null,
      error: 'Unable to connect to the server. Please check your internet connection and try again.'
    };
  }
};