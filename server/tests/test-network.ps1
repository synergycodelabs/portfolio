# Network connectivity test script
$ErrorActionPreference = "Stop"

Write-Host "`nStarting network tests..." -ForegroundColor Cyan

# Test DNS resolution
Write-Host "`nTesting DNS resolution:" -ForegroundColor Yellow
try {
    $dns = Resolve-DnsName "api.synergycodelabs.com" -ErrorAction Stop
    Write-Host "DNS Resolution successful:" -ForegroundColor Green
    Write-Host $dns | Format-Table -AutoSize
} catch {
    Write-Host "DNS Resolution failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Test port 80 connectivity
Write-Host "`nTesting port 80 connectivity:" -ForegroundColor Yellow
$ip = "72.79.21.7"
$port = 80

try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $conn = $tcp.BeginConnect($ip, $port, $null, $null)
    $wait = $conn.AsyncWaitHandle.WaitOne(1000, $false)
    
    if ($wait) {
        $tcp.EndConnect($conn)
        Write-Host "Port 80 is open and accessible" -ForegroundColor Green
    } else {
        Write-Host "Connection timeout" -ForegroundColor Red
    }
    $tcp.Close()
} catch {
    Write-Host "Connection failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Test HTTP response
Write-Host "`nTesting HTTP response headers:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://$ip/health" -Method GET -TimeoutSec 5 -UseBasicParsing
    Write-Host "HTTP Response successful:" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Headers:"
    $response.Headers | Format-Table -AutoSize
} catch {
    Write-Host "HTTP Request failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host "`nNetwork tests completed." -ForegroundColor Cyan