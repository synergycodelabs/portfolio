import { getApiUrl } from '@/config/api';

/**
 * Simple mobile detection RegExp
 */
const isMobile = /iPhone|iPad|iPod|Android|Windows Phone|IEMobile/i.test(navigator.userAgent);

/**
 * Attempt a network request with normal fetch.
 * On failure (and if mobile), fallback to XMLHttpRequest.
 *
 * @param {string} url - The URL to request.
 * @param {object} [options={}] - Fetch/Request options (method, headers, body).
 * @returns {Promise<Response>} - A promise that resolves to a "Response-like" object.
 */
async function mobileFallbackFetch(url, options = {}) {
  try {
    // 1) Primary attempt: normal fetch
    const response = await fetch(url, options);
    // If fetch didn't throw an error, just return that response
    return response;
  } catch (fetchError) {
    console.warn('Fetch failed, checking for mobile fallback:', fetchError);

    // 2) If we’re on mobile, try basic XMLHttpRequest
    if (isMobile) {
      try {
        return await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(options.method || 'GET', url, true);

          // Set headers if we have them
          if (options.headers) {
            Object.entries(options.headers).forEach(([key, value]) => {
              xhr.setRequestHeader(key, value);
            });
          }

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              // Create a "Response-like" object
              const json = () => Promise.resolve(JSON.parse(xhr.responseText));
              const text = () => Promise.resolve(xhr.responseText);
              resolve({
                ok: true,
                status: xhr.status,
                json,
                text,
              });
            } else {
              reject(new Error(`XHR status: ${xhr.status}`));
            }
          };

          xhr.onerror = () => reject(new Error('XHR error'));
          xhr.ontimeout = () => reject(new Error('XHR timeout'));

          if (options.body) {
            xhr.send(options.body);
          } else {
            xhr.send();
          }
        });
      } catch (xhrError) {
        console.error('Mobile XHR fallback failed:', xhrError);
        throw new Error('All requests failed on mobile');
      }
    }

    // If we’re not on mobile, or if XHR also failed, rethrow
    throw fetchError;
  }
}

/**
 * Check server connection with fallback for mobile devices.
 */
export const checkServerConnection = async () => {
  const url = getApiUrl('status');
  console.log('checkServerConnection -> URL:', url, 'isMobile:', isMobile);

  try {
    const response = await mobileFallbackFetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Try parsing JSON
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.warn('Could not parse JSON:', e);
      data = {};
    }

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
 * Send chat message with fallback for mobile devices.
 */
export const sendChatMessage = async (message) => {
  const url = getApiUrl('chat');
  console.log('sendChatMessage -> URL:', url, 'Message:', message, 'isMobile:', isMobile);

  try {
    const response = await mobileFallbackFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.warn('Could not parse JSON from chat:', e);
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