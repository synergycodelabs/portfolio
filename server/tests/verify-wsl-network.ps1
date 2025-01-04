# WSL2 Network Verification Script
# Purpose: Test connectivity between Windows host and WSL2
# Author: Angel
# Last Updated: 2025-01-04

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$message)
    Write-Host "`n=== $message ===`n" -ForegroundColor Cyan
}

function Test-WSLNetwork {
    Write-Header "Network Interfaces"
    
    # Windows IP
    Write-Host "Windows IP Configuration:" -ForegroundColor Yellow
    ipconfig | Select-String -Context 0,4 "IPv4"
    
    # WSL IP
    Write-Host "`nWSL IP Configuration:" -ForegroundColor Yellow
    wsl hostname -I
    
    Write-Host "`nTesting connectivity:" -ForegroundColor Yellow
    
    # Test Windows to WSL
    $wslIP = "192.168.1.164"
    Write-Host "`nTesting Windows (192.168.1.152) to WSL ($wslIP):"
    Test-NetConnection -ComputerName $wslIP -Port 80 | Format-List
    
    # Check port forwarding
    Write-Host "`nChecking port forwarding rules:" -ForegroundColor Yellow
    netsh interface portproxy show all
}

# Run tests
Write-Host "Starting WSL2 network verification..." -ForegroundColor Cyan
Test-WSLNetwork
Write-Host "`nVerification complete." -ForegroundColor Cyan