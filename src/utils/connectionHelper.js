// src/utils/connectionHelper.js
import { getApiUrl } from '@/config/api';

const debugFetch = async (url, options = {}) => {
  console.log('Attempting fetch:', {
    url,
    options,
    timestamp: new Date().toISOString()
  });

  try {
    // Test basic connectivity
    const pingResponse = await fetch(url, {
      method: 'HEAD',
      mode: 'cors',
      cache: 'no-cache'
    });
    
    console.log('Ping response:', {
      ok: pingResponse.ok,
      status: pingResponse.status
    });

    // Actual request
    const response = await fetch(url, {
      ...options,
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    console.log('Fetch response:', {
      ok: response.ok,
      status: response.status,
      headers: Object.fromEntries([...response.headers])
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error details:', {
      name: error.name,
      message: error.message,
      url,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

export const checkServerConnection = async () => {
  const browserInfo = {
    isMobile: /iPhone|iPad|iPod|Android|Windows Phone|IEMobile/i.test(navigator.userAgent),
    isEdge: /Edg/i.test(navigator.userAgent),
    userAgent: navigator.userAgent
  };
  
  console.log('Browser details:', browserInfo);

  try {
    const url = getApiUrl('status');
    console.log('Checking API:', url);

    const data = await debugFetch(url);
    console.log('Status response:', data);
    
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
    console.log('Sending chat message:', { url, messageLength: message.length });

    const data = await debugFetch(url, {
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