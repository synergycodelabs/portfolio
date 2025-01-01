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
- Portfolio website with React and Vite
- AI-powered chat assistant
- HTTPS support with Let's Encrypt
- Docker containerization
- Nginx reverse proxy
- GitHub Pages deployment
- Cross-browser and mobile compatibility

## Architecture
The application consists of three main components:
- Frontend: React application served via GitHub Pages
- API Server: Node.js backend running in Docker
- Nginx: Reverse proxy handling SSL termination and routing

[Previous sections remain the same until Configuration...]

## Mobile Compatibility

### Browser Support
The application includes special handling for different mobile browsers:
- Android: Chrome, Firefox, Edge (with special handling)
- iOS: Safari, Chrome
- Edge Mobile: Custom CORS and connection handling

### Mobile-Specific Features
1. Edge Mobile Support:
```javascript
// Connection Helper Configuration
const isMobile = /iPhone|iPad|iPod|Android|Windows Phone|IEMobile/i.test(navigator.userAgent);
const isEdge = /Edg/i.test(navigator.userAgent);

if (isMobile && isEdge) {
  // Special handling for Edge mobile
  // Custom fetch configuration
  // Connection status monitoring
}
```

2. CORS Configuration:
```javascript
// Server CORS handling
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'];
  const isEdge = /Edg/i.test(userAgent);
  
  if (isEdge) {
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

3. Connection Fallbacks:
- XMLHttpRequest for Edge mobile
- Fetch API with timeout
- Status monitoring and auto-reconnect
- Error handling with user feedback

### UI Adaptations
- Responsive chat window positioning
- Mobile-friendly button placement
- Touch-optimized interactions
- Adaptive status indicators

[Previous Configuration sections remain the same...]

## Troubleshooting

### Common Issues

1. CORS Errors
- Check nginx CORS configuration
- Verify allowed origins match GitHub Pages domain
- Ensure single Access-Control-Allow-Origin header
- For mobile Edge:
  - Check user agent detection
  - Verify mobile-specific CORS headers
  - Test both fetch and XMLHttpRequest approaches

2. Mobile Browser Issues
- Edge Mobile Connection:
  - Clear browser cache
  - Check console for CORS errors
  - Verify API availability
  - Test direct API access
  - Check network connectivity

3. Connection Issues
- Check Docker container status
- Verify port forwarding configuration
- Check network firewall settings
- For mobile devices:
  - Test direct API access
  - Verify CORS headers
  - Check connection timeouts

4. API Availability
- Test API status endpoint
- Check container logs
- Verify network connectivity
- For mobile testing:
```bash
# Test direct API access
curl -I https://api.synergycodelabs.com/api/status

# Test with mobile user agent
curl -I -H "User-Agent: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile" \
     https://api.synergycodelabs.com/api/status
```

For more detailed troubleshooting steps, check the logs:
```bash
docker logs portfolio-nginx
docker logs portfolio-api
```

## License
MIT License - see LICENSE file for details