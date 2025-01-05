#!/bin/sh

set -e

CERT_PATH="/etc/letsencrypt/live/${DOMAIN}"
SELF_SIGNED=${SELF_SIGNED:-""} # Читаем переменную или используем пустую строку по умолчанию

# Проверяем, равна ли переменная SELF_SIGNED "true"
if [ "$SELF_SIGNED" = "true" ]; then
    echo "SELF_SIGNED is set to 'true'. Generating self-signed certificate for ${DOMAIN}..."

    # Создаем директорию для сертификатов, если ее нет
    mkdir -p "${CERT_PATH}"

    # Генерация самоподписанного сертификата
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "${CERT_PATH}/privkey.pem" \
        -out "${CERT_PATH}/fullchain.pem" \
        -subj "/CN=${DOMAIN}"

    echo "Self-signed certificate generated at ${CERT_PATH}."
else
    echo "SELF_SIGNED is not 'true'. Creating certificate via certbot..."
    certbot certonly \
      --standalone \
      -d $DOMAIN -d www.$DOMAIN \
      --email $EMAIL \
      --non-interactive \
      --agree-tos \
      --no-eff-email
      
      echo "Starting crond..."
      crond
fi

