# WSL2 Port Forwarding Setup Script
# Purpose: Configure port forwarding between Windows host and WSL2
# Author: Angel
# Last Updated: 2025-01-04

# Requires elevation
#Requires -RunAsAdministrator

$ErrorActionPreference = "Stop"

# WSL2 Configuration
$wslIP = "192.168.1.164"  # WSL2 IP
$windowsIP = "192.168.1.152"  # Windows IP
$ports = @(80, 443, 3002)  # Ports to forward

function Remove-ExistingRules {
    Write-Host "Removing existing port forwarding rules..." -ForegroundColor Yellow
    netsh interface portproxy reset
}

function Add-PortForwarding {
    param(
        [int]$port
    )
    Write-Host "Adding port forwarding for port $port..." -ForegroundColor Yellow
    
    # Add port forwarding rule
    $command = "netsh interface portproxy add v4tov4 listenport=$port listenaddress=$windowsIP connectport=$port connectaddress=$wslIP"
    Invoke-Expression $command
    
    # Add firewall rule if it doesn't exist
    $ruleName = "WSL2_Port_$port"
    if (-not (Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue)) {
        New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Action Allow -Protocol TCP -LocalPort $port
        Write-Host "Added firewall rule for port $port" -ForegroundColor Green
    }
}

try {
    # Remove existing rules
    Remove-ExistingRules
    
    # Add new port forwarding rules
    foreach ($port in $ports) {
        Add-PortForwarding -port $port
    }
    
    # Verify configuration
    Write-Host "`nCurrent port forwarding configuration:" -ForegroundColor Cyan
    netsh interface portproxy show all
    
    Write-Host "`nWSL2 port forwarding setup complete!" -ForegroundColor Green
} catch {
    Write-Host "Error during setup: $($_.Exception.Message)" -ForegroundColor Red
}