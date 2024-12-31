## Architecture Overview

The Portfolio API Server is built using a modern microservices architecture with Docker, consisting of three main components:

1. **Nginx (Reverse Proxy)**
   - Handles SSL/TLS termination
   - Manages HTTPS redirects
   - Routes traffic to the API service
   - Manages CORS headers

2. **Certbot**
   - Automatically manages SSL certificates
   - Integrates with Let's Encrypt
   - Handles certificate renewals

3. **Node.js API Server**
   - Serves the portfolio API endpoints
   - Manages chat functionality with OpenAI integration
   - Handles embeddings for context-aware responses

## Infrastructure Setup

### Docker Compose Configuration

The system uses Docker Compose to orchestrate three services:

```yaml
services:
  nginx:
    # Handles SSL and proxying
    ports:
      - \"80:80\"
      - \"443:443\"
    volumes:
      - ./nginx/conf:/etc/nginx/conf.d
      - ./nginx/certbot/conf:/etc/letsencrypt

  certbot:
    # Manages SSL certificates
    volumes:
      - ./nginx/certbot/www:/var/www/certbot
      - ./nginx/certbot/conf:/etc/letsencrypt

  api:
    # Portfolio API service
    ports:
      - \"3002:3002\"
    environment:
      - NODE_ENV=production
      - PORT=3002
```

### SSL Configuration

SSL certificates are managed through Let's Encrypt using Certbot:
- Domain: api.synergycodelabs.com
- Certificate Path: /etc/letsencrypt/live/api.synergycodelabs.com/
- Auto-renewal: Handled by Certbot container

## API Server Components

### Core Files Structure

```
server/
|-- app.js                 # Express application setup
|-- server.js             # Server initialization
|-- config/
|   |-- environment.js    # Environment configuration
|   `-- openaiClient.js   # OpenAI client setup
|-- api/
|   `-- chat.js          # Chat endpoint handlers
|-- controllers/
|   |-- chatController.js    # Chat logic
|   `-- statusController.js  # Status endpoint
|-- routes/
|   |-- chatRoutes.js    # Chat routing
|   `-- statusRoutes.js  # Status routing
`-- utils/
    |-- embeddingsLoader.js  # Load embeddings
    |-- contextHelper.js     # Context processing
    `-- logger.js           # Logging utility
```

### Key Components

1. **Environment Configuration**
   - Production vs Development settings
   - CORS configuration
   - API keys and security settings

2. **Chat System**
   - OpenAI integration
   - Embeddings-based context retrieval
   - Response generation

3. **Status Monitoring**
   - Server health checks
   - Embeddings status
   - System configuration information

## Environment Variables

Create a `.env` file in the server directory:

```env
NODE_ENV=production
PORT=3002
ALLOWED_ORIGINS=https://synergycodelabs.github.io
OPENAI_API_KEY=your-key-here
```

## API Endpoints

### Status Endpoint
- URL: `/api/status`
- Method: `GET`
- Response Example:
```json
{
  \"status\": \"online\",
  \"embeddings\": \"loaded\",
  \"embeddingsCount\": 21,
  \"currentPath\": \"/app/controllers\",
  \"dataPath\": \"/app/data/embeddings.json\",
  \"timestamp\": \"2024-12-31T07:27:53.726Z\"
}
```

### Chat Endpoint
- URL: `/api/chat`
- Method: `POST`
- Body:
```json
{
  \"message\": \"Your question here\"
}
```

## Development Workflow

1. **Local Development**
```bash
npm install
npm run dev
```

2. **Building Embeddings**
```bash
# Generate embeddings for the chat system
node scripts/generate-embeddings.js
```

3. **Production Deployment**
```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Security Considerations

1. **SSL/TLS**
   - All HTTP traffic is automatically redirected to HTTPS
   - Managed by Nginx and Certbot
   - Certificates auto-renew

2. **CORS**
   - Strictly configured for allowed origins
   - Handles preflight requests
   - Production origins limited to specific domains

3. **API Security**
   - Helmet.js for HTTP headers
   - Rate limiting implemented
   - Input validation on all endpoints

## Troubleshooting

1. **SSL Issues**
   - Check Certbot logs: `docker-compose logs certbot`
   - Verify certificate renewal: `docker-compose exec certbot certbot certificates`

2. **API Issues**
   - Check API logs: `docker-compose logs api`
   - Verify environment variables
   - Check embeddings status through status endpoint

3. **CORS Issues**
   - Verify allowed origins in environment.js
   - Check Nginx CORS headers configuration
   - Confirm client origin matches allowed origins

## Maintenance

1. **Regular Tasks**
   - Monitor SSL certificate expiration
   - Update embeddings when portfolio content changes
   - Check logs for any errors or issues

2. **Updates**
   - Regular dependency updates
   - Security patches
   - OpenAI API version compatibility

## Contributing

1. **Code Style**
   - Use ES6+ features
   - Follow existing patterns
   - Document new endpoints or features

2. **Testing**
   - Test locally before deployment
   - Verify CORS with actual frontend
   - Check all endpoints function correctly

## Architecture Decisions

1. **Why Nginx?**
   - Professional-grade reverse proxy
   - Efficient SSL handling
   - Built-in security features

2. **Why Separate Services?**
   - Better separation of concerns
   - Independent scaling
   - Easier maintenance and updates

3. **Why Embeddings?**
   - Context-aware chat responses
   - Better user experience
   - Efficient information retrieval