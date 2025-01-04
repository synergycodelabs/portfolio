FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application files
COPY . .

# Debug: List contents
RUN ls -la

# Expose port
EXPOSE 3002

# Set Node options for ESM
ENV NODE_OPTIONS="--experimental-specifier-resolution=node --es-module-specifier-resolution=node"

# Start the application
CMD ["node", "server.js"]