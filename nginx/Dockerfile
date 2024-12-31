FROM nginx:1.25-alpine

# Copy certificates from archive to live when container starts
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-fix-certs.sh && \
    echo 'mkdir -p /etc/letsencrypt/live/api.synergycodelabs.com' >> /docker-entrypoint.d/40-fix-certs.sh && \
    echo 'cp /etc/letsencrypt/archive/api.synergycodelabs.com/cert1.pem /etc/letsencrypt/live/api.synergycodelabs.com/cert.pem' >> /docker-entrypoint.d/40-fix-certs.sh && \
    echo 'cp /etc/letsencrypt/archive/api.synergycodelabs.com/chain1.pem /etc/letsencrypt/live/api.synergycodelabs.com/chain.pem' >> /docker-entrypoint.d/40-fix-certs.sh && \
    echo 'cp /etc/letsencrypt/archive/api.synergycodelabs.com/fullchain1.pem /etc/letsencrypt/live/api.synergycodelabs.com/fullchain.pem' >> /docker-entrypoint.d/40-fix-certs.sh && \
    echo 'cp /etc/letsencrypt/archive/api.synergycodelabs.com/privkey1.pem /etc/letsencrypt/live/api.synergycodelabs.com/privkey.pem' >> /docker-entrypoint.d/40-fix-certs.sh && \
    echo 'chmod -R 755 /etc/letsencrypt/live' >> /docker-entrypoint.d/40-fix-certs.sh && \
    echo 'chmod 700 /etc/letsencrypt/live/api.synergycodelabs.com/privkey.pem' >> /docker-entrypoint.d/40-fix-certs.sh && \
    chmod +x /docker-entrypoint.d/40-fix-certs.sh