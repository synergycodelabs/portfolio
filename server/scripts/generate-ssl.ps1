# SSL Certificate Generation Script for Windows using Certbot
Write-Host "Starting SSL Certificate Generation..."

# Variables
$domain = "72.79.21.7"
$email = "angel@synergycodelabs.com"
$certbotPath = "C:\certbot\certbot-auto"

# Create directories if they don't exist
$sslPath = "..\ssl"
if (!(Test-Path $sslPath)) {
    New-Item -ItemType Directory -Force -Path $sslPath
}

# Install Certbot if not already installed (requires admin privileges)
if (!(Test-Path $certbotPath)) {
    Write-Host "Installing Certbot..."
    # Download Certbot-Win
    $winAcmePath = "$env:USERPROFILE\win-acme"
    Invoke-WebRequest -Uri "https://github.com/win-acme/win-acme/releases/download/v2.2.5/win-acme.v2.2.5.1758.x64.trimmed.zip" -OutFile "win-acme.zip"
    Expand-Archive "win-acme.zip" -DestinationPath $winAcmePath -Force
    Remove-Item "win-acme.zip"
}

# Generate certificates using standalone mode
Write-Host "Generating SSL certificates..."
try {
    # Stop any process using port 80
    $processOnPort = Get-NetTCPConnection -LocalPort 80 -ErrorAction SilentlyContinue
    if ($processOnPort) {
        Stop-Process -Id $processOnPort.OwningProcess -Force
    }

    # Run Certbot
    & $certbotPath certonly `
        --standalone `
        --preferred-challenges http `
        --email $email `
        --agree-tos `
        --no-eff-email `
        -d $domain `
        --cert-path $sslPath

    # Copy certificates to the right location
    Copy-Item "C:\Certbot\live\$domain\privkey.pem" "$sslPath\private.key" -Force
    Copy-Item "C:\Certbot\live\$domain\fullchain.pem" "$sslPath\certificate.crt" -Force

    Write-Host "SSL Certificates generated successfully!"
} catch {
    Write-Host "Error generating certificates: $_"
    exit 1
}

Write-Host "Certificate generation complete!"