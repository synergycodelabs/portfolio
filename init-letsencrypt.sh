#!/bin/bash

# Domains being used
domains="angel.synergycodelabs.com api.synergycodelabs.com"
email="angel@synergycodelabs.com"
staging=0 # Set to 0 for production certificates

# Certbot & nginx paths
data_path="./certbot"
nginx_config="./nginx/conf/default.conf"

# Create required directories
for domain in $domains; do
  mkdir -p "$data_path/conf/live/$domain"
done
mkdir -p "$data_path/www"

# Create temporary nginx config if not exists
if [ ! -f $nginx_config ]; then
  echo "Creating temporary nginx config..."
  mkdir -p ./nginx/conf
  cat > $nginx_config << EOF
# Main portfolio frontend
server {
    listen 80;
    server_name angel.synergycodelabs.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name angel.synergycodelabs.com;

    ssl_certificate /etc/letsencrypt/live/angel.synergycodelabs.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/angel.synergycodelabs.com/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://host.docker.internal:3002;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

# API backend
server {
    listen 80;
    server_name api.synergycodelabs.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name api.synergycodelabs.com;

    ssl_certificate /etc/letsencrypt/live/api.synergycodelabs.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.synergycodelabs.com/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://host.docker.internal:3002;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api {
        proxy_pass http://host.docker.internal:3002;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
fi

# Start nginx container
echo "### Starting nginx..."
docker compose down
docker compose up --force-recreate -d nginx

# Wait for nginx to start
echo "### Waiting for nginx to start..."
sleep 5

# Request certificates for all domains
echo "### Requesting Let's Encrypt certificates..."
for domain in $domains; do
  echo "Getting certificate for $domain..."
  docker compose run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
      --email $email \
      $(if [ $staging != "0" ]; then echo "--staging"; fi) \
      --rsa-key-size 4096 \
      --agree-tos \
      --force-renewal \
      --non-interactive \
      -d $domain" certbot
done

# Reload nginx
echo "### Reloading nginx ..."
docker compose exec nginx nginx -s reload

# Copy certificates to server/ssl directory
echo "### Copying certificates to server/ssl directory..."
mkdir -p ./server/ssl
# Using the first domain's certificate for the Node.js server
main_domain=$(echo $domains | cut -d' ' -f1)
cp "./certbot/conf/live/$main_domain/privkey.pem" "./server/ssl/private.key"
cp "./certbot/conf/live/$main_domain/fullchain.pem" "./server/ssl/certificate.crt"

echo "### Done! Certificate setup completed."