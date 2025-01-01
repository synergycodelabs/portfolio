import { getApiUrl } from '@/config/api';

// Browser detection
const isMobile = /iPhone|iPad|iPod|Android|Windows Phone|IEMobile/i.test(navigator.userAgent);
const isEdge = /Edg/i.test(navigator.userAgent);

// Test different fetch configurations
const testFetchConfigs = async (url) => {
  const configs = [
    {
      name: "Basic fetch",
      config: {
        method: 'GET'
      }
    },
    {
      name: "No-cors mode",
      config: {
        method: 'GET',
        mode: 'no-cors'
      }
    },
    {
      name: "With credentials",
      config: {
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
      }
    },
    {
      name: "Without credentials",
      config: {
        method: 'GET',
        credentials: 'omit',
        mode: 'cors'
      }
    },
    {
      name: "With headers",
      config: {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    },
    {
      name: "With cache control",
      config: {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }
    }
  ];

  console.log('Starting fetch tests...');
  
  for (const {name, config} of configs) {
    try {
      console.log(`Testing ${name}...`);
      console.log('Config:', config);
      
      const response = await fetch(url, config);
      const status = response.status;
      let data = null;
      
      try {
        data = await response.json();
      } catch (e) {
        console.log(`${name} - Could not parse JSON:`, e.message);
      }
      
      console.log(`${name} Results:`, {
        success: response.ok,
        status,
        data,
        headers: Object.fromEntries([...response.headers])
      });
    } catch (error) {
      console.log(`${name} Failed:`, {
        error: error.toString(),
        type: error.name,
        message: error.message
      });
    }
  }
};

// Check server connection
// In connectionHelper.js
export const checkServerConnection = async () => {
  try {
    console.log('Browser details:', {
      isMobile,
      isEdge,
      userAgent: navigator.userAgent
    });

    const url = getApiUrl('status');
    
    // Try direct status check first
    if (isMobile && isEdge) {
      try {
        // Direct XMLHttpRequest check
        const response = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.timeout = 5000; // 5 second timeout
          xhr.open('GET', url, true);
          
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(xhr.responseText);
            } else {
              reject(new Error(`HTTP ${xhr.status}`));
            }
          };
          
          xhr.onerror = () => reject(new Error('XHR failed'));
          xhr.ontimeout = () => reject(new Error('XHR timeout'));
          
          xhr.send();
        });

        const data = JSON.parse(response);
        console.log('XHR succeeded:', data);
        
        return {
          status: data.status || 'online',
          secure: true,
          error: null
        };
      } catch (xhrError) {
        console.log('XHR failed, trying ping check:', xhrError);
        
        // If XHR fails, try a simple fetch to check connectivity
        const pingResponse = await fetch(url, {
          method: 'HEAD',
          mode: 'no-cors'
        });
        
        // If we get here without error, assume we're online
        return {
          status: 'online',
          secure: true,
          error: null
        };
      }
    }

    // Default fetch for non-Edge-mobile browsers
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
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

// Send chat message
// In connectionHelper.js
export const sendChatMessage = async (message) => {
  try {
    const isMobile = /iPhone|iPad|iPod|Android|Windows Phone|IEMobile/i.test(navigator.userAgent);
    const isEdge = /Edg/i.test(navigator.userAgent);
    
    console.log('Sending chat message to:', getApiUrl('chat'));
    
    // Special handling for Edge mobile
    if (isMobile && isEdge) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', getApiUrl('chat'), true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');
        
        xhr.onload = function() {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve({
                success: true,
                response: data.response || data.message || 'No response received',
                error: null
              });
            } catch (error) {
              resolve({
                success: false,
                response: null,
                error: 'Error parsing response'
              });
            }
          } else {
            resolve({
              success: false,
              response: null,
              error: `HTTP ${xhr.status}: ${xhr.statusText}`
            });
          }
        };
        
        xhr.onerror = function() {
          resolve({
            success: false,
            response: null,
            error: 'Unable to connect to the server. Please check your internet connection and try again.'
          });
        };
        
        xhr.send(JSON.stringify({ message }));
      });
    }

    // Regular fetch for other browsers
    const response = await fetch(getApiUrl('chat'), {
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