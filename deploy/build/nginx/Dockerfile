FROM nginx:1.27.0-alpine

RUN apk add --no-cache certbot certbot-nginx curl bash

RUN mkdir -p /var/www/certbot
RUN mkdir -p /var/log/cron

COPY default.conf.template /etc/nginx/templates/default.conf.template

COPY certbot-cron /etc/crontabs/root
RUN chmod 0644 /etc/crontabs/root

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80 443

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
