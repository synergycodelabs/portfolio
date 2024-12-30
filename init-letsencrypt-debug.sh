#!/bin/bash

echo "Starting nginx..."
docker-compose up -d nginx

echo "Waiting for nginx to start..."
sleep 5

echo "Testing challenge path..."
curl -v http://localhost/.well-known/acme-challenge/test

echo "Testing external access..."
curl -v http://angel.synergycodelabs.com/.well-known/acme-challenge/test

echo "Checking nginx logs..."
docker logs portfolio-nginx