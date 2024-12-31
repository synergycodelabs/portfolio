#!/bin/bash

# Ensure the live directory exists
mkdir -p /etc/letsencrypt/live/api.synergycodelabs.com

# Copy the certificates from archive to live
cp /etc/letsencrypt/archive/api.synergycodelabs.com/cert1.pem /etc/letsencrypt/live/api.synergycodelabs.com/cert.pem
cp /etc/letsencrypt/archive/api.synergycodelabs.com/chain1.pem /etc/letsencrypt/live/api.synergycodelabs.com/chain.pem
cp /etc/letsencrypt/archive/api.synergycodelabs.com/fullchain1.pem /etc/letsencrypt/live/api.synergycodelabs.com/fullchain.pem
cp /etc/letsencrypt/archive/api.synergycodelabs.com/privkey1.pem /etc/letsencrypt/live/api.synergycodelabs.com/privkey.pem

# Set proper permissions
chmod -R 755 /etc/letsencrypt/live
chmod 700 /etc/letsencrypt/live/api.synergycodelabs.com/privkey.pem