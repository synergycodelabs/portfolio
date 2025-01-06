#!/bin/bash

echo "Stopping all portfolio services..."

# Function to check if a service is stopped
check_service_stopped() {
    local service=$1
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if ! systemctl is-active --quiet $service; then
            echo "$service is now stopped"
            return 0
        fi
        echo "Waiting for $service to stop... (attempt $attempt/$max_attempts)"
        sleep 1
        ((attempt++))
    done
    
    echo "Failed to stop $service after $max_attempts attempts"
    return 1
}

# Stop frontend (find and kill the Vite process)
echo "Stopping frontend development server..."
pkill -f "vite"

# Stop development API
echo "Stopping development API..."
sudo systemctl stop portfolio-api-dev
check_service_stopped portfolio-api-dev

# Stop production API
echo "Stopping production API..."
sudo systemctl stop portfolio-api-prod
check_service_stopped portfolio-api-prod

echo "All services stopped!"
