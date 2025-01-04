# Comprehensive setup verification script
# Purpose: Test all components of the portfolio API setup
# Author: Angel
# Last Updated: 2025-01-04

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$message)
    Write-Host "`n=== $message ===" -ForegroundColor Cyan
}

function Test-Endpoint {
    param(
        [string]$name,
        [string]$url,
        [string]$method = "GET"
    )
    Write-Host "`nTesting $name..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $url -Method $method -UseBasicParsing
        Write-Host "Success ($($response.StatusCode))" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Begin testing
Write-Header "Container Status"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Header "Network Status"
docker network inspect portfolio-network

Write-Header "NGINX Configuration"
docker exec portfolio-nginx nginx -T

Write-Header "Testing Endpoints"

# Local endpoints
Test-Endpoint "Local Health" "http://localhost/health"
Test-Endpoint "Local API Status" "http://localhost/api/status"

# Internal communication
Write-Host "`nTesting internal communication..." -ForegroundColor Yellow
$result = docker exec portfolio-nginx curl -s http://portfolio-api:3002/api/status
Write-Host "Response: $result"

# Public endpoints
Test-Endpoint "Public Health" "http://api.synergycodelabs.com/health"
Test-Endpoint "Public API Status" "http://api.synergycodelabs.com/api/status"

Write-Header "Logs"
Write-Host "`nNGINX Logs:" -ForegroundColor Yellow
docker logs --tail 50 portfolio-nginx

Write-Host "`nAPI Logs:" -ForegroundColor Yellow
docker logs --tail 50 portfolio-api

Write-Header "Test Complete"