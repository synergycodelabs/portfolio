#!/bin/bash

echo "Creating test challenge file..."
mkdir -p ./certbot/www/.well-known/acme-challenge/
echo "THIS_IS_A_TEST_FILE" > ./certbot/www/.well-known/acme-challenge/test.txt

echo "Starting nginx..."
docker-compose down
docker-compose up -d nginx

echo "Waiting for nginx to start..."
sleep 5

echo "Testing local access..."
curl http://localhost/.well-known/acme-challenge/test.txt

echo "Testing domain access..."
curl http://angel.synergycodelabs.com/.well-known/acme-challenge/test.txt