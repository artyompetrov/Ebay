Инструкция по настройке автодеплоя:
https://www.youtube.com/watch?v=f5AlQE0i5m0&ab_channel=Programonaut


# Проброс сертификата letsencrypt в портейнер
docker run -d -p 8000:8000 -p 9443:9443 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v /etc/letsencrypt/:/certs portainer/portainer-ce --sslcert /certs/live/naks42.ru/cert.pem --sslkey /certs/live/naks42.ru/privkey.pem

Статистика по курсам валют тут
https://openexchangerates.org/account

CREATE EXTENSION hstore;

Добавить поддержку:
https://ebay.com/p/6017012255?iid=326024002095
https://www.ebay.com/itm/175893251126?tool_productId=084b0333-f829-429b-a5ff-562a3689a18b


Иконки
https://icones.js.org/collection/oi











# Создание самоподписанного сетификата для локальной отладки:
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