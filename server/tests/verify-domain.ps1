# Domain verification script
# Purpose: Test domain configuration and public access
# Author: Angel
# Last Updated: 2025-01-04

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$message)
    Write-Host "`n=== $message ===`n" -ForegroundColor Cyan
}

function Test-DNS {
    Write-Header "DNS Resolution"
    
    try {
        $dns = Resolve-DnsName "api.synergycodelabs.com" -ErrorAction Stop
        Write-Host "DNS Records:" -ForegroundColor Green
        $dns | Format-Table Name, Type, IPAddress -AutoSize
    } catch {
        Write-Host "DNS Resolution Error:" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

function Test-Port {
    param([string]$ip)
    Write-Header "Port Connectivity"
    
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $connection = $tcp.BeginConnect($ip, 80, $null, $null)
        $wait = $connection.AsyncWaitHandle.WaitOne(1000, $false)
        
        if ($wait) {
            $tcp.EndConnect($connection)
            Write-Host "Successfully connected to $ip:80" -ForegroundColor Green
        } else {
            Write-Host "Connection timeout to $ip:80" -ForegroundColor Red
        }
        
        $tcp.Close()
    } catch {
        Write-Host "Connection Error:" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

function Test-WebAccess {
    param([string]$url)
    Write-Header "Web Access"
    
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing
        Write-Host "Response from $url" -ForegroundColor Green
        Write-Host "Status Code: $($response.StatusCode)"
        Write-Host "Headers:"
        $response.Headers | Format-Table -AutoSize
    } catch {
        Write-Host "Web Access Error:" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

# Main test sequence
Write-Host "Starting domain verification..." -ForegroundColor Cyan

Test-DNS

$ip = "72.79.21.7"  # Your domain IP
Test-Port $ip

$urls = @(
    "http://api.synergycodelabs.com/health",
    "http://api.synergycodelabs.com/api/status"
)

foreach ($url in $urls) {
    Test-WebAccess $url
}

Write-Host "`nVerification complete." -ForegroundColor Cyan