#!/bin/bash
echo "Stopping frontend development server..."
pkill -f "node.*[0-9]+/portfolio.*dev"
echo "Frontend server stopped"
