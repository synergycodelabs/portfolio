# Portfolio with Chat Assistant

A modern portfolio website with an integrated AI chat assistant, built with React, Node.js, and Docker.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Code Organization](#code-organization)
- [Development](#development)
- [Installation](#installation)
- [Configuration](#configuration)
- [Mobile Support](#mobile-support)
- [Testing](#testing)
- [Deployment](#deployment)
- [Repository Structure](#repository-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Components
- Portfolio website built with React and Vite
- AI-powered chat assistant with 24/7 availability
- HTTPS implementation with Let's Encrypt
- Docker containerization for consistent deployment
- Nginx reverse proxy with security optimizations
- GitHub Pages integration
- Cross-browser and mobile compatibility

### Technical Implementation
```javascript
// Example of modular code organization
src/
├── components/         # Reusable UI components
├── utils/             # Helper functions and utilities
├── services/          # API and external service integrations
├── hooks/             # Custom React hooks
├── config/            # Configuration management
└── tests/             # Test suites mirroring src structure

### Security Features
- SSL certificate management and auto-renewal
- Secure CORS configuration with environment-specific settings
- Environment variable management
- Input sanitization and validation

## Code Organization

### Project Structure
portfolio/
├── src/               # Source code
├── server/            # Backend API
├── nginx/             # Nginx configuration
├── tests/             # Test suites
├── docs/              # Documentation
└── scripts/           # Utility scripts

### Development Standards
- Clear, self-documenting code with meaningful comments
- Modular architecture with single-responsibility components
- Comprehensive error handling and logging
- Test-driven development approach

## Mobile Support

### Browser Compatibility
```javascript
// Universal browser detection
const browserDetection = {
  isMobile: /Mobile/i.test(navigator.userAgent),
  isEdge: /Edg/i.test(navigator.userAgent),
  isChrome: /Chrome/i.test(navigator.userAgent),
  isFirefox: /Firefox/i.test(navigator.userAgent)
};
```

### Connection Handling
```javascript
// Robust mobile request handling
const mobileRequest = async (url, options = {}) => {
  try {
    // Primary request method
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Request failed:', error);
    // Implement fallback mechanism
    return fallbackRequest(url, options);
  }
};
```

## Repository Structure

### Branch Organization
main                   # Primary development branch
├── feature/*          # Feature branches
├── bugfix/*           # Bug fix branches
└── gh-pages           # Production deployment (automated)

### Development Workflow
1. Create feature branch:
   ```bash
   git checkout -b feature/new-feature main
   ```

2. Make changes following style guide:
   ```bash
   # Use meaningful commit messages
   git commit -m "feat: add mobile browser support"
   ```

3. Deploy to production:
   ```bash
   npm run deploy  # Automatically updates gh-pages
   ```

## Testing
- Unit tests for core functionality
- Integration tests for API endpoints
- Mobile compatibility testing
- Cross-browser testing suite

## Error Handling
```javascript
// Example error handling implementation
try {
  // Core functionality
} catch (error) {
  logger.error({
    message: 'Operation failed',
    error: error.toString(),
    timestamp: new Date().toISOString()
  });
  // Implement graceful fallback
}
```

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:
- Code style and standards
- Development workflow
- Testing requirements
- Pull request process

## License
MIT License - see [LICENSE](LICENSE) file for details