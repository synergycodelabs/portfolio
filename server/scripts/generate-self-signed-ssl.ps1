# Self-signed SSL Certificate Generation Script
Write-Host "Generating self-signed SSL certificates..."

# Create SSL directory if it doesn't exist
$sslPath = "..\ssl"
if (!(Test-Path $sslPath)) {
    New-Item -ItemType Directory -Force -Path $sslPath
}

# Generate private key
openssl genrsa -out "$sslPath\private.key" 2048

# Generate CSR
openssl req -new -key "$sslPath\private.key" -out "$sslPath\certificate.csr" -subj "/C=US/ST=YourState/L=YourCity/O=YourOrganization/CN=72.79.21.7"

# Generate self-signed certificate
openssl x509 -req -days 365 -in "$sslPath\certificate.csr" -signkey "$sslPath\private.key" -out "$sslPath\certificate.crt"

Write-Host "Self-signed certificates generated successfully!"