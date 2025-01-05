#!/bin/bash

# Start frontend
echo "Starting frontend..."
cd /home/masd/projects/portfolio
npm run dev &

# Start backend
echo "Starting backend..."
cd server
node server.js &

# Check nginx
echo "Checking nginx status..."
sudo systemctl status nginx

# Wait for user input to terminate
read -p "Press any key to terminate all processes..."

# Cleanup
pkill -f "node"
echo "Development servers stopped"
