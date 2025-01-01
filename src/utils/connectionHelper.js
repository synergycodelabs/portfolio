import { getApiUrl } from '@/config/api';
// In src/utils/connectionHelper.js
const isMobile = /iPhone|iPad|iPod|Android|Windows Phone|IEMobile/i.test(navigator.userAgent);
const isEdge = /Edg/i.test(navigator.userAgent);

export const checkServerConnection = async () => {
  try {
    console.log('Browser details:', {
      isMobile,
      isEdge,
      userAgent: navigator.userAgent
    });
    
    // Try using XMLHttpRequest for Edge Mobile
    if (isMobile && isEdge) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', getApiUrl('status'), true);
        xhr.setRequestHeader('Accept', 'application/json');
        
        xhr.onload = function() {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log('XHR response:', data);
            resolve({
              status: data.status,
              secure: data.secure,
              error: null
            });
          } else {
            resolve({
              status: 'offline',
              secure: false,
              error: `HTTP ${xhr.status}`
            });
          }
        };
        
        xhr.onerror = function() {
          console.error('XHR failed:', xhr.statusText);
          resolve({
            status: 'offline',
            secure: false,
            error: xhr.statusText
          });
        };
        
        xhr.send();
      });
    }

    // Regular fetch for other browsers
    const response = await fetch(getApiUrl('status'), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetch response:', data);

    return {
      status: data.status,
      secure: data.secure,
      error: null
    };
  } catch (error) {
    console.error('Connection check failed:', {
      isMobile,
      isEdge,
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