FROM node:18-slim

WORKDIR /usr/src/app

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy server and API code
COPY server/ ./

# Create directory for embedding data
RUN mkdir -p data

EXPOSE 3002

CMD ["node", "server.js"]