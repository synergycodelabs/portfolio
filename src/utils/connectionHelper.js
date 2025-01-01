import { getApiUrl } from '@/config/api';

/**
 * Detect whether the user is on a mobile browser.
 */
const isMobile = /iPhone|iPad|iPod|Android|Windows Phone|IEMobile/i.test(navigator.userAgent);

/**
 * Attempt a network request via XMLHttpRequest first, then fallback to fetch with no-cors if it fails.
 * This is designed to accommodate stricter mobile browsers (Edge, Firefox, Chrome on mobile, etc.).
 *
 * @param {string} url - The URL to request.
 * @param {object} [options={}] - Optional configurations (method, headers, body, etc.).
 * @returns {Promise<Response>} - A promise that resolves with a "Response-like" object.
 */
async function mobileRequest(url, options = {}) {
  // Try XMLHttpRequest first
  try {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(options.method || 'GET', url, true);

      // If there are headers, set them
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      // If there's a timeout or advanced config, you can set it here
      xhr.timeout = 5000; // 5-second timeout (example)

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            // Attempt to parse JSON
            const data = JSON.parse(xhr.responseText);
            // Mimic the Fetch API's Response object
            resolve({
              ok: true,
              status: xhr.status,
              json: () => Promise.resolve(data),
              text: () => Promise.resolve(xhr.responseText),
            });
          } catch (e) {
            // If not valid JSON, still return something usable
            resolve({
              ok: true,
              status: xhr.status,
              text: () => Promise.resolve(xhr.responseText),
            });
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error'));
      };

      xhr.ontimeout = () => {
        reject(new Error('XHR timeout'));
      };

      // Send the body if present (for POST requests)
      xhr.send(options.body || null);
    });
  } catch (xhrError) {
    console.log('XMLHttpRequest failed, trying fetch no-cors fallback:', xhrError);

    // Fallback to fetch with no-cors
    return fetch(url, {
      ...options,
      mode: 'no-cors',
      credentials: 'omit', // be sure credentials are omitted
    });
  }
}

/**
 * (Optional) A function to test different fetch configurations.
 * Useful for debugging if you still want to see how each config behaves on mobile.
 */
const testFetchConfigs = async (url) => {
  const configs = [
    {
      name: 'Basic fetch',
      config: { method: 'GET' },
    },
    {
      name: 'No-cors mode',
      config: { method: 'GET', mode: 'no-cors' },
    },
    {
      name: 'With credentials',
      config: { method: 'GET', credentials: 'include', mode: 'cors' },
    },
    {
      name: 'Without credentials',
      config: { method: 'GET', credentials: 'omit', mode: 'cors' },
    },
    {
      name: 'With headers',
      config: {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
    {
      name: 'With cache control',
      config: {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      },
    },
  ];

  console.log('Starting fetch tests...');

  for (const { name, config } of configs) {
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
        headers: Object.fromEntries([...response.headers]),
      });
    } catch (error) {
      console.log(`${name} Failed:`, {
        error: error.toString(),
        type: error.name,
        message: error.message,
      });
    }
  }
};

/**
 * Check server connection, using a mobile fallback if on a mobile browser.
 */
export const checkServerConnection = async () => {
  try {
    const url = getApiUrl('status');
    console.log('checkServerConnection -> URL:', url);
    console.log('checkServerConnection -> isMobile:', isMobile);

    // (Optional) Test different fetch configs if you still want debugging
    // await testFetchConfigs(url);

    let response;
    if (isMobile) {
      // Use the mobileRequest fallback approach
      response = await mobileRequest(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });
    } else {
      // Desktop / non-mobile can use normal fetch
      response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.log('Could not parse JSON for checkServerConnection:', e.message);
      data = {};
    }

    // If the API doesn't return a "status" field, default to 'online'
    return {
      status: data.status || 'online',
      secure: true,
      error: null,
    };
  } catch (error) {
    console.error('Connection check failed:', error);
    return {
      status: 'offline',
      secure: false,
      error: error.message,
    };
  }
};

/**
 * Send a chat message to the server, using a mobile fallback if on a mobile browser.
 */
export const sendChatMessage = async (message) => {
  try {
    const url = getApiUrl('chat');
    console.log('sendChatMessage -> URL:', url, 'Message:', message);

    let response;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ message }),
    };

    if (isMobile) {
      // Use the mobileRequest fallback approach
      response = await mobileRequest(url, options);
    } else {
      // Desktop / non-mobile can use normal fetch
      response = await fetch(url, options);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.log('Could not parse JSON for sendChatMessage:', e.message);
      data = {};
    }

    return {
      success: true,
      response: data.response || data.message || 'No response received',
      error: null,
    };
  } catch (error) {
    console.error('Chat request failed:', error);

    const errorMessage = error.message.includes('Failed to fetch')
      ? 'Unable to connect to the server. Please check your internet connection and try again.'
      : 'Sorry, I encountered an error. Please try again later.';

    return {
      success: false,
      response: null,
      error: errorMessage,
    };
  }
};