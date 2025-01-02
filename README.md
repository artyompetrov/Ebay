Инструкция по настройке автодеплоя:
https://www.youtube.com/watch?v=f5AlQE0i5m0&ab_channel=Programonaut

# Генерация сетрификата
\deploy\config\localhost_debug_certs\create_certs.sh

# Проброс сертификата letsencrypt в портейнер
docker run -d -p 8000:8000 -p 9443:9443 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v /etc/letsencrypt/:/certs portainer/portainer-ce --sslcert /certs/live/tubes.com.ru/cert.pem --sslkey /certs/live/tubes.com.ru/privkey.pem

Статистика по курсам валют тут
https://openexchangerates.org/account

CREATE EXTENSION hstore;

Добавить поддержку:
https://ebay.com/p/6017012255?iid=326024002095
https://www.ebay.com/itm/175893251126?tool_productId=084b0333-f829-429b-a5ff-562a3689a18b


Иконки
https://icones.js.org/collection/oi











