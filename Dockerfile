FROM node:20.11.1-slim

# Install required packages for SSL and certbot
RUN apt-get update && \
    apt-get install -y \
    curl \
    openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy server and API code
COPY server/ ./

# Create directories for SSL and data
RUN mkdir -p data ssl

# Expose ports for HTTP and HTTPS
EXPOSE 3002 3003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3002/api/status || exit 1

CMD ["node", "server.js"]