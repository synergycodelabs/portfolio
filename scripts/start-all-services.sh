#!/bin/bash

echo "Starting all portfolio services..."

# Function to check if a service is active
check_service() {
    local service=$1
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if systemctl is-active --quiet $service; then
            echo "$service is now running"
            return 0
        fi
        echo "Waiting for $service to start... (attempt $attempt/$max_attempts)"
        sleep 1
        ((attempt++))
    done
    
    echo "Failed to start $service after $max_attempts attempts"
    return 1
}

# Start production API
echo "Starting production API..."
sudo systemctl start portfolio-api-prod
check_service portfolio-api-prod

# Start development API
echo "Starting development API..."
sudo systemctl start portfolio-api-dev
check_service portfolio-api-dev

# Start frontend development server
echo "Starting frontend..."
cd ~/projects/portfolio
npm run dev

echo "All services started!"
