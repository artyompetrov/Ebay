#!/bin/bash


# Создание приватного ключа
openssl genrsa -out localhost.key 2048

# Создание запроса на сертификат
openssl req -new -key localhost.key -out localhost.csr -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=localhost"

# Создание файла конфигурации
cat > localhost.ext <<EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
EOF

# Создание самоподписанного сертификата
openssl x509 -req -in localhost.csr -signkey localhost.key -out localhost.crt -days 36500 -extfile localhost.ext
openssl pkcs12 -in localhost.crt -inkey localhost.key -export -out localhost.pfx -passout pass:qwerty123