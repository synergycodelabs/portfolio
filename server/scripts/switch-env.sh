#!/bin/bash
# Create in /home/masd/projects/portfolio/server/scripts/switch-env.sh

case "$1" in
  "dev")
    echo "Switching to development environment..."
    sudo systemctl stop portfolio-api-prod
    sudo systemctl start portfolio-api-dev
    echo "Development server started on port 3003"
    ;;
  "prod")
    echo "Switching to production environment..."
    sudo systemctl stop portfolio-api-dev
    sudo systemctl start portfolio-api-prod
    echo "Production server started on port 3003 and 48763"
    ;;
  *)
    echo "Usage: $0 {dev|prod}"
    exit 1
    ;;
esac

# Show status
echo "Current service status:"
echo "Development service:"
sudo systemctl status portfolio-api-dev
echo "Production service:"
sudo systemctl status portfolio-api-prod