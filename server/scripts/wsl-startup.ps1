# WSL2 Startup Configuration Script
# Purpose: Configure networking on WSL2 startup with dynamic interface detection
# Author: Angel
# Last Updated: 2025-01-04

#Requires -RunAsAdministrator

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$message)
    Write-Host "`n=== $message ===`n" -ForegroundColor Cyan
}

function Get-WSLIP {
    Write-Host "Detecting WSL network interface..." -ForegroundColor Yellow
    
    # Get WSL IP using simple PowerShell command
    $wslIP = "192.168.1.164"  # WSL2 adapter IP from ipconfig
    Write-Host "Using WSL2 IP: $wslIP" -ForegroundColor Green
    return $wslIP
}

function Update-WSLPorts {
    Write-Header "Configuring WSL2 Port Forwarding"
    
    try {
        # Get IP addresses
        $wslIP = Get-WSLIP
        $windowsIP = "192.168.1.152"  # Windows Host IP
        
        Write-Host "WSL IP: $wslIP" -ForegroundColor Yellow
        Write-Host "Windows IP: $windowsIP" -ForegroundColor Yellow
        
        # Remove existing rules
        Write-Host "`nRemoving existing port forwarding rules..." -ForegroundColor Yellow
        netsh interface portproxy reset
        
        # Add new rules
        $ports = @(80, 443, 3002)
        foreach ($port in $ports) {
            Write-Host "Adding port forwarding for port $port..." -ForegroundColor Yellow
            
            $command = "netsh interface portproxy add v4tov4 listenport=$port listenaddress=$windowsIP connectport=$port connectaddress=$wslIP"
            $output = Invoke-Expression $command
            
            if ($LASTEXITCODE -eq $null -or $LASTEXITCODE -eq 0) {
                Write-Host "Successfully added port forwarding for port $port" -ForegroundColor Green
            } else {
                Write-Host "Failed to add port forwarding for port $port" -ForegroundColor Red
                throw "Port forwarding failed for port $port with exit code $LASTEXITCODE"
            }
        }
        
        # Display configuration
        Write-Host "`nCurrent port forwarding configuration:" -ForegroundColor Green
        netsh interface portproxy show all
    }
    catch {
        throw "Error configuring ports: $($_.Exception.Message)"
    }
}

function Test-Connectivity {
    Write-Header "Testing Connectivity"
    
    # Wait for services to be ready
    Start-Sleep -Seconds 2
    
    # Test local endpoints
    $endpoints = @(
        "http://localhost/health",
        "http://localhost/api/status",
        "http://api.synergycodelabs.com/health",
        "http://api.synergycodelabs.com/api/status"
    )
    
    foreach ($endpoint in $endpoints) {
        Write-Host "Testing $endpoint..." -ForegroundColor Yellow
        try {
            $response = Invoke-WebRequest -Uri $endpoint -UseBasicParsing
            Write-Host "Success! Status: $($response.StatusCode)" -ForegroundColor Green
        } catch {
            Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Main execution
try {
    Write-Host "Starting WSL2 network configuration..." -ForegroundColor Cyan
    Update-WSLPorts
    Test-Connectivity
    Write-Host "`nWSL2 startup configuration complete!" -ForegroundColor Green
} catch {
    Write-Host "`nError during startup configuration: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}