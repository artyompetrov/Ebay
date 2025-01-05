FROM nginx:1.27.0-alpine

RUN apk add --no-cache certbot certbot-nginx curl bash

RUN mkdir -p /var/www/certbot
RUN mkdir -p /var/log/cron

COPY default.conf.template /etc/nginx/templates/default.conf.template

COPY certbot-cron /etc/crontabs/root
RUN chmod 0644 /etc/crontabs/root

COPY certbot.sh /docker-entrypoint.d/00-certbot.sh
RUN chmod +x /docker-entrypoint.d/00-certbot.sh