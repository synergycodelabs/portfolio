import { getApiUrl } from '@/config/api';

/**
 * Detect mobile and Edge specifically.
 */
const isMobile = /iPhone|iPad|iPod|Android|Windows Phone|IEMobile/i.test(navigator.userAgent);
const isEdge = /Edg/i.test(navigator.userAgent);

/**
 * Check server connection – 
 *   1) If mobile + Edge, use an XHR approach first. 
 *   2) If that fails, try a simple HEAD request w/ no-cors. 
 *   3) Otherwise, just do a normal fetch.
 */
export const checkServerConnection = async () => {
  try {
    console.log('Browser details:', {
      isMobile,
      isEdge,
      userAgent: navigator.userAgent,
    });

    const url = getApiUrl('status');
    console.log('API URL:', url);

    // Special handling for Edge mobile
    if (isMobile && isEdge) {
      try {
        // Use XMLHttpRequest for status
        const responseText = await new Promise((resolve, reject) => {
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

        const data = JSON.parse(responseText);
        console.log('XHR succeeded:', data);
        return {
          status: data.status || 'online',
          secure: data.secure || false,
          error: null,
        };
      } catch (xhrError) {
        console.log('XHR failed, trying HEAD check:', xhrError);

        // If XHR fails, do a HEAD request in no-cors
        await fetch(url, {
          method: 'HEAD',
          mode: 'no-cors',
        });

        // If we get here without an exception, assume online
        return {
          status: 'online',
          secure: false,
          error: null,
        };
      }
    }

    // Default fetch for other browsers
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      status: data.status || 'online',
      secure: data.secure || false,
      error: null,
    };
  } catch (error) {
    console.error('Connection check failed:', {
      isMobile,
      isEdge,
      error: error.toString(),
      url: getApiUrl('status'),
    });

    return {
      status: 'offline',
      secure: false,
      error: error.message,
    };
  }
};

/**
 * Send chat message – 
 *   1) If mobile + Edge, use XMLHttpRequest for POST. 
 *   2) Otherwise, normal fetch.
 */
export const sendChatMessage = async (message) => {
  try {
    console.log('Sending chat message to:', getApiUrl('chat'));

    // Re-detect for clarity
    const isMobile = /iPhone|iPad|iPod|Android|Windows Phone|IEMobile/i.test(navigator.userAgent);
    const isEdge = /Edg/i.test(navigator.userAgent);

    if (isMobile && isEdge) {
      // XHR approach for Edge mobile
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', getApiUrl('chat'), true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');

        xhr.onload = function () {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve({
                success: true,
                response: data.response || data.message || 'No response received',
                error: null,
              });
            } catch (parseErr) {
              resolve({
                success: false,
                response: null,
                error: 'Error parsing response',
              });
            }
          } else {
            resolve({
              success: false,
              response: null,
              error: `HTTP ${xhr.status}: ${xhr.statusText}`,
            });
          }
        };

        xhr.onerror = function () {
          resolve({
            success: false,
            response: null,
            error:
              'Unable to connect to the server. Please check your internet connection and try again.',
          });
        };

        xhr.send(JSON.stringify({ message }));
      });
    }

    // Normal fetch for other browsers
    const response = await fetch(getApiUrl('chat'), {
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

    const data = await response.json();
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