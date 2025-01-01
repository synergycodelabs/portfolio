import { getApiUrl } from '@/config/api';

// In connectionHelper.js
export const checkServerConnection = async () => {
  try {
    console.log('Checking server connection...');
    const url = getApiUrl('status');
    console.log('API URL:', url);

    // Simplified fetch request without credentials
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Server response:', data);

    return {
      status: data.status,
      secure: data.secure,
      error: null
    };
  } catch (error) {
    console.error('Server connection check failed:', {
      error: error.toString(),
      message: error.message,
      type: error.name,
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