// config/sslConfig.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'private.key')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'certificate.crt'))
};

export default sslOptions;