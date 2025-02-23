#!/bin/sh

set -e

CERT_PATH="/etc/letsencrypt/live/${DOMAIN}"
SELF_SIGNED_CERTIFICATE=${SELF_SIGNED_CERTIFICATE:-""} # Читаем переменную или используем пустую строку по умолчанию
PRIVKEY_FILE="${CERT_PATH}/privkey.pem"
FULLCHAIN_FILE="${CERT_PATH}/fullchain.pem"

CONFIG_FILE="${CERT_PATH}/openssl.cnf"

# Проверяем, равна ли переменная SELF_SIGNED_CERTIFICATE "true"
if [ "$SELF_SIGNED_CERTIFICATE" = "true" ]; then
    echo "SELF_SIGNED_CERTIFICATE is set to 'true'. Generating self-signed certificate for ${DOMAIN}..."
    
    if [ -f "$PRIVKEY_FILE" ] && [ -f "$FULLCHAIN_FILE" ]; then
            echo "Certificates already exist at ${CERT_PATH}. Skipping generation."
        else
            # Создаем директорию для сертификатов, если ее нет
            mkdir -p "${CERT_PATH}"
        
            if [ ! -f "$CONFIG_FILE" ]; then
                cat > "$CONFIG_FILE" <<EOL
[ req ]
distinguished_name = req_distinguished_name
x509_extensions = v3_req

[ req_distinguished_name ]
commonName = Common Name (e.g. server FQDN or YOUR name)

[ v3_req ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = localhost
IP.1 = 127.0.0.1
EOL
            fi
        
            # Генерация самоподписанного сертификата
            openssl req -x509 -nodes -days 36500 -newkey rsa:2048 \
                -keyout "${CERT_PATH}/privkey.pem" \
                -out "${CERT_PATH}/fullchain.pem" \
                -subj "/CN=${DOMAIN}" \
                -extensions v3_req -config "$CONFIG_FILE"
        
            echo "Self-signed certificate generated at ${CERT_PATH}."
        fi
else
    echo "SELF_SIGNED_CERTIFICATE is not 'true'. Creating certificate via certbot..."
    certbot certonly \
      --standalone \
      -d $DOMAIN \
      --email $EMAIL \
      --non-interactive \
      --agree-tos \
      --no-eff-email \
      -v
      
      echo "Starting service cron..."
      service cron start
fi

