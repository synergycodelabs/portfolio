@echo off

echo Creating directories...
if not exist "nginx\certbot\conf" mkdir "nginx\certbot\conf"
if not exist "nginx\certbot\www" mkdir "nginx\certbot\www"

echo Stopping containers...
docker compose down

echo Starting nginx...
docker compose up -d nginx

echo Waiting for nginx to start...
timeout /t 10

echo Requesting certificates...
docker compose run --rm --entrypoint "certbot certonly --webroot --webroot-path=/var/www/certbot --email angel@synergycodelabs.com --agree-tos --no-eff-email --force-renewal -d angel.synergycodelabs.com -d api.synergycodelabs.com" certbot

echo Checking certificate status...
if exist "nginx\certbot\conf\live\angel.synergycodelabs.com\fullchain.pem" (
    echo Certificates obtained successfully!
    echo Updating nginx configuration...
    copy /Y "nginx\conf\default-ssl.conf" "nginx\conf\default.conf"
    
    echo Starting all services...
    docker compose up -d
) else (
    echo Certificate generation failed!
    echo Check the logs above for more details.
)

echo Done!