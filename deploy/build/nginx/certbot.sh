#!/bin/sh

set -e

echo "Creating certificate..."
certbot certonly \
  --standalone \
  -d $DOMAIN -d www.$DOMAIN \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email

echo "Starting crond..."
crond