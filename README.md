# Portfolio with Chat Assistant

A modern portfolio website with an integrated AI chat assistant, built with React, Node.js, and Docker.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## Features
- Portfolio website with React and Vite
- AI-powered chat assistant
- HTTPS support with Let's Encrypt
- Docker containerization
- Nginx reverse proxy
- GitHub Pages deployment

## Architecture
The application consists of three main components:
- Frontend: React application served via GitHub Pages
- API Server: Node.js backend running in Docker
- Nginx: Reverse proxy handling SSL termination and routing

## Prerequisites
- Node.js 18 or higher
- Docker and Docker Compose
- Git
- Windows with WSL2 (for development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Create `.env` file in the root directory
- Add required environment variables:
```env
NODE_ENV=development
PORT=3002
```

4. Start development environment:
```bash
npm run dev
```

## Development

### Local Development
1. Start the development server:
```bash
npm run dev
```
- Frontend will be available at http://localhost:3001
- API will be available at http://localhost:3002

### Docker Development
1. Build and start containers:
```bash
docker-compose up -d
```

2. Check container status:
```bash
docker ps
docker logs portfolio-nginx
docker logs portfolio-api
```

## Deployment

### GitHub Pages Deployment
1. Push changes to main branch:
```bash
git add .
git commit -m "your changes"
git push origin main
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

### Server Configuration

#### Nginx Configuration
The nginx configuration handles SSL termination and proxies requests to the API:

\`\`\`nginx
server {
    listen 443 ssl http2;
    server_name api.synergycodelabs.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.synergycodelabs.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.synergycodelabs.com/privkey.pem;

    # CORS Configuration
    location /api/ {
        proxy_pass http://api:3002/api/;
        proxy_http_version 1.1;
        
        # CORS headers for GitHub Pages
        if ($http_origin = "https://synergycodelabs.github.io") {
            add_header 'Access-Control-Allow-Origin' 'https://synergycodelabs.github.io' always;
        }
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' '*' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
    }
}
\`\`\`

#### API Configuration
1. Environment settings (`server/config/environment.js`):
```javascript
export default {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3002,
    HOST: '0.0.0.0'
}
```

2. Frontend API configuration (`src/config/api.js`):
```javascript
export const getApiUrl = (endpoint) => {
  const baseUrl = import.meta.env.PROD
    ? 'https://api.synergycodelabs.com'
    : 'http://localhost:3002';
  return `${baseUrl}${endpoints[endpoint]}`;
};
```

## Configuration

### Docker Configuration
1. Services defined in `docker-compose.yml`:
- nginx: Reverse proxy and SSL termination
- api: Node.js backend service

2. Nginx Dockerfile:
- Based on nginx:1.25-alpine
- Handles SSL certificate management
- Configures CORS and proxy settings

### WSL2 Configuration
1. Update `.wslconfig`:
```ini
[wsl2]
memory=16GB
processors=4
localhostForwarding=true
```

2. Configure port forwarding:
```powershell
netsh interface portproxy add v4tov4 listenport=80 connectport=80 connectaddress=(wsl2-ip)
netsh interface portproxy add v4tov4 listenport=443 connectport=443 connectaddress=(wsl2-ip)
netsh interface portproxy add v4tov4 listenport=3002 connectport=3002 connectaddress=(wsl2-ip)
```

## Troubleshooting

### Common Issues

1. CORS Errors
- Check nginx CORS configuration
- Verify allowed origins match GitHub Pages domain
- Ensure single Access-Control-Allow-Origin header

2. SSL Certificate Issues
- Verify certificate paths in nginx configuration
- Check certificate renewal status
- Ensure proper SSL configuration

3. Connection Issues
- Check Docker container status
- Verify port forwarding configuration
- Check network firewall settings

4. API Availability
- Test API status endpoint
- Check container logs
- Verify network connectivity

For more detailed troubleshooting steps, check the logs:
```bash
docker logs portfolio-nginx
docker logs portfolio-api
```

## License
MIT License - see LICENSE file for details