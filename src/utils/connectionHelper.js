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
export const checkServerConnection = async () => {
  try {
    console.log('Browser details:', {
      isMobile,
      isEdge,
      userAgent: navigator.userAgent
    });

    const url = getApiUrl('status');
    console.log('Testing URL:', url);

    // Run all fetch configurations
    await testFetchConfigs(url);

    // Try default configuration after testing
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
    console.error('Final connection check failed:', {
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