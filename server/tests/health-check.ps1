# Health check script for portfolio API
$ErrorActionPreference = "Stop"

Write-Host "`nStarting health checks..." -ForegroundColor Cyan

# Test local health endpoint
Write-Host "`nTesting local health endpoint:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing
    Write-Host "Local health check response: " -NoNewline
    Write-Host $response.StatusCode -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Error accessing local health endpoint:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Test local API status
Write-Host "`nTesting local API status:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost/api/status" -UseBasicParsing
    Write-Host "Local API status response: " -NoNewline
    Write-Host $response.StatusCode -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Error accessing local API status:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Test public domain health
Write-Host "`nTesting public domain health endpoint:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://api.synergycodelabs.com/health" -UseBasicParsing
    Write-Host "Public domain health check response: " -NoNewline
    Write-Host $response.StatusCode -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Error accessing public domain health endpoint:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Test public domain API status
Write-Host "`nTesting public domain API status:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://api.synergycodelabs.com/api/status" -UseBasicParsing
    Write-Host "Public domain API status response: " -NoNewline
    Write-Host $response.StatusCode -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Error accessing public domain API status:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host "`nHealth checks completed." -ForegroundColor Cyan