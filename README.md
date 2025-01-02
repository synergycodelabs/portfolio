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
- [Mobile Compatibility](#mobile-compatibility)
- [Troubleshooting](#troubleshooting)

## Features

### Core Features
- Portfolio website with React and Vite
- AI-powered chat assistant
- HTTPS support with Let's Encrypt
- Docker containerization
- Nginx reverse proxy
- GitHub Pages deployment
- Cross-browser and mobile compatibility

### Technical Features
- Updated nginx configuration with security best practices
- Environment-specific server configuration (local/production)
- Enhanced chat controller with improved error handling and logging
- Modular server architecture for maintainability
- HTTPS implementation with Let's Encrypt
- SSL certificate management and auto-renewal
- 24/7 chat assistant availability with business hours integration
- Mobile console integration (Eruda)
- Custom chat UI with hover effects
- Horizontally scrollable mobile navigation
- Browser-specific connection handlers
- Universal mobile browser support
- Comprehensive fetch configuration testing

## Architecture
The application consists of three main components:
- Frontend: React application served via GitHub Pages
- API Server: Node.js backend running in Docker
- Nginx: Reverse proxy handling SSL termination and routing

### Development Philosophy
1. **Clarity and Simplicity**
   - Clear and straightforward code
   - Consistent naming conventions
   - Descriptive comments and documentation

2. **Modularity and Organization**
   - Single responsibility principle
   - Logical file organization
   - Reusable components

3. **Testing-First Approach**
   - Unit tests for core functionality
   - Integration tests for API endpoints
   - Mobile compatibility testing

4. **Security Best Practices**
   - HTTPS implementation
   - Secure CORS configuration
   - Environment variable management

## Mobile Compatibility

### Browser Support
The application includes special handling for different mobile browsers:
- Android: Chrome, Firefox, Edge (with special handling)
- iOS: Safari, Chrome
- Edge Mobile: Custom CORS and connection handling

### Mobile-Specific Features
1. **Universal Browser Support**:
```javascript
// Connection Helper Configuration
const isMobile = /iPhone|iPad|iPod|Android|Windows Phone|IEMobile/i.test(navigator.userAgent);
const browserType = (() => {
  const ua = navigator.userAgent;
  if (/Edg/i.test(ua)) return 'edge';
  if (/firefox/i.test(ua)) return 'firefox';
  if (/chrome/i.test(ua)) return 'chrome';
  return 'other';
})();
```

2. **CORS Configuration**:
```javascript
// Server CORS handling
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'];
  const isMobile = /Mobile/i.test(userAgent);
  
  if (isMobile) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
  } else {
    res.header('Access-Control-Allow-Origin', environment.ALLOWED_ORIGINS);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  }
  
  next();
});
```

3. **Connection Handling**:
```javascript
// Mobile request handler with fallback
const mobileRequest = async (url, options = {}) => {
  try {
    // Try XMLHttpRequest first
    const xhrResponse = await xhrRequest(url, options);
    return xhrResponse;
  } catch (error) {
    // Fallback to fetch with no-cors
    return fetch(url, {
      ...options,
      mode: 'no-cors',
      credentials: 'omit'
    });
  }
};
```

### UI Adaptations
- Responsive chat window positioning
- Mobile-friendly button placement
- Touch-optimized interactions
- Adaptive status indicators

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check nginx CORS configuration
   - Verify allowed origins match GitHub Pages domain
   - Check mobile-specific CORS headers
   - Test with different request methods

2. **Mobile Browser Issues**
   - Clear browser cache
   - Check console for CORS errors
   - Verify API availability
   - Test direct API access
   - Check network connectivity

3. **Connection Issues**
   - Verify Docker container status
   - Check port forwarding
   - Test API endpoints directly
   - Verify SSL certificate validity

### Debugging Commands
```bash
# Test API status
curl -I https://api.synergycodelabs.com/api/status

# Test with mobile user agent
curl -I -H "User-Agent: Mozilla/5.0 (Mobile)" \
     https://api.synergycodelabs.com/api/status

# Check container logs
docker logs portfolio-nginx
docker logs portfolio-api
```

## Installation & Development
[Previous sections for Installation, Development, and Deployment remain the same]

## License
MIT License - see LICENSE file for details