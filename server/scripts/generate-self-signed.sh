#!/bin/bash

# Create SSL directory if it doesn't exist
mkdir -p ../ssl

# Generate private key
openssl genrsa -out ../ssl/private.key 2048

# Generate self-signed certificate
openssl req -x509 -new -nodes -key ../ssl/private.key -sha256 -days 365 -out ../ssl/certificate.crt \
-subj "/C=US/ST=State/L=City/O=Organization/CN=72.79.21.7"

echo "Self-signed certificate generated successfully!"