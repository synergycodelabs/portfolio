// src/utils/connectionHelper.js
import { getApiUrl } from '@/config/api';

// Helper function for browser detection
const getBrowserInfo = () => {
  const isMobile = /iPhone|iPad|iPod|Android|Windows Phone|IEMobile/i.test(navigator.userAgent);
  const isEdge = /Edg/i.test(navigator.userAgent);
  return { isMobile, isEdge };
};

// Helper for XHR requests
const sendXHRRequest = async (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.open(options.method || 'GET', url, true);
    
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch (e) {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
      }
    };
    
    xhr.onerror = () => reject(new Error('Network Error'));
    xhr.ontimeout = () => reject(new Error('Request Timeout'));
    
    xhr.send(options.body);
  });
};

export const checkServerConnection = async () => {
  try {
    const { isMobile, isEdge } = getBrowserInfo();
    console.log('Browser details:', { isMobile, isEdge, userAgent: navigator.userAgent });

    const url = getApiUrl('status');
    console.log('Checking status at:', url);

    if (isMobile && isEdge) {
      try {
        const data = await sendXHRRequest(url, {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        console.log('Status response:', data);
        return {
          status: data.status || 'online',
          secure: true,
          error: null
        };
      } catch (error) {
        console.error('Status check failed:', error);
        return {
          status: 'offline',
          secure: false,
          error: error.message
        };
      }
    }

    // Default fetch for other browsers
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
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
    const { isMobile, isEdge } = getBrowserInfo();
    const url = getApiUrl('chat');
    console.log('Sending chat message to:', url);

    if (isMobile && isEdge) {
      try {
        const data = await sendXHRRequest(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ message })
        });
        
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
    }

    // Regular fetch for other browsers
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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