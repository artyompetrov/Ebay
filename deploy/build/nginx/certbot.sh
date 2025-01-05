#!/bin/sh
set -e

echo "Creating certificate if not exists"
certbot certonly \
  --webroot -w /var/www/certbot \
  -d $DOMAIN -d www.$DOMAIN \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email

echo "Starting crond..."
crond