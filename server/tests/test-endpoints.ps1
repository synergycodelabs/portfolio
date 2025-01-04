# Enhanced endpoint testing script
# Purpose: Test all API endpoints and their connectivity
$ErrorActionPreference = "Stop"

function Test-Endpoint {
    param (
        [string]$name,
        [string]$url
    )
    Write-Host "`nTesting $name..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing
        Write-Host "Success! Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Response: $($response.Content)"
    } catch {
        Write-Host "Failed! Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test suite
Write-Host "Starting endpoint tests..." -ForegroundColor Cyan

# Local tests
Test-Endpoint "Local Health" "http://localhost/health"
Test-Endpoint "Local API Status" "http://localhost/api/status"

# Container internal tests
Write-Host "`nTesting internal container communication..." -ForegroundColor Yellow
docker exec portfolio-nginx curl -s http://portfolio-api:3002/api/status

# Public domain tests
Test-Endpoint "Public Health" "http://api.synergycodelabs.com/health"
Test-Endpoint "Public API Status" "http://api.synergycodelabs.com/api/status"

Write-Host "`nTests completed." -ForegroundColor Cyan