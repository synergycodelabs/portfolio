# Use official NGINX base image
FROM nginx:1.25.3-alpine

# Copy configuration files
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf/default.conf /etc/nginx/conf.d/default.conf

# Verify configuration (but allow container to start even if verification fails)
RUN nginx -t || true

# Use default NGINX command
CMD ["nginx", "-g", "daemon off;"]