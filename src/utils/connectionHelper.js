import { getApiUrl } from '@/config/api';
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const checkServerConnection = async () => {
  try {
    console.log('Device type:', isMobile ? 'Mobile' : 'Desktop');
    
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // Special handling for mobile
    if (isMobile) {
      headers['Cache-Control'] = 'no-cache';
      headers['Pragma'] = 'no-cache';
    }

    const response = await fetch(getApiUrl('status'), {
      method: 'GET',
      headers: headers,
      mode: 'cors',
      cache: 'no-cache'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Server responded:', data);

    return {
      status: data.status,
      secure: data.secure,
      error: null
    };
  } catch (error) {
    console.error('Connection check failed:', {
      isMobile,
      error: error.toString(),
      url: getApiUrl('status')
    });

    return {
      status: 'offline',
      secure: false,
      error: error.message
    };
  }
};

export const sendChatMessage = async (message) => {
  try {
    console.log('Sending chat message to:', getApiUrl('chat'));
    
    const response = await fetch(getApiUrl('chat'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    console.log('Chat response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Chat response:', data);
    
    return {
      success: true,
      response: data.response || data.message || 'No response received',
      error: null
    };
  } catch (error) {
    console.error('Chat request failed:', error);
    
    const errorMessage = error.message.includes('Failed to fetch')
      ? 'Unable to connect to the server. Please check your internet connection and try again.'
      : 'Sorry, I encountered an error. Please try again later.';

    return {
      success: false,
      response: null,
      error: errorMessage
    };
  }
};