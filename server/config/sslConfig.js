// config/sslConfig.js
import fs from 'fs';

const SSL_CERT_PATH = '/etc/letsencrypt/live/api.synergycodelabs.com/fullchain.pem';
const SSL_KEY_PATH = '/etc/letsencrypt/live/api.synergycodelabs.com/privkey.pem';

const loadSSLConfig = () => {
  try {
    return {
      cert: fs.readFileSync(SSL_CERT_PATH),
      key: fs.readFileSync(SSL_KEY_PATH)
    };
  } catch (error) {
    console.error('Error loading SSL configuration:', error);
    throw error;
  }
};

export default loadSSLConfig;