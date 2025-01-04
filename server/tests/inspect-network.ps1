# Network inspection script
# Purpose: Verify Docker network configuration and container connectivity
# Author: Angel
# Last Updated: 2025-01-04

$ErrorActionPreference = "Stop"

function Test-DockerNetwork {
    Write-Host "`nInspecting Docker networks..." -ForegroundColor Cyan

    # List all networks
    Write-Host "`nDocker networks:" -ForegroundColor Yellow
    docker network ls

    # Inspect portfolio network
    Write-Host "`nInspecting portfolio-network:" -ForegroundColor Yellow
    docker network inspect portfolio-network

    # Check container connectivity
    Write-Host "`nContainer status:" -ForegroundColor Yellow
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

    # Test internal networking
    Write-Host "`nTesting internal network communication:" -ForegroundColor Yellow
    docker exec portfolio-nginx curl -s http://portfolio-api:3002/health
}

# Run tests
try {
    Test-DockerNetwork
} catch {
    Write-Host "Error during network inspection:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}