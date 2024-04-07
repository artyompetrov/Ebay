Инструкция по настройке автодеплоя:
https://www.youtube.com/watch?v=f5AlQE0i5m0&ab_channel=Programonaut

Самоподписанный сетрификат:
touch ssl.conf
nano ssl.conf:
[ req ]
default_bits = 4096
distinguished_name = req_distinguished_name
req_extensions = req_ext
prompt = no

[ req_distinguished_name ]
commonName = 178.208.65.100

[ req_ext ]
subjectAltName = IP:178.208.65.100

openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem -config ssl.conf
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.cert -extensions req_ext -extfile ssl.conf
openssl pkcs12 -inkey key.pem -in cert.cert -export -out pfx.pfx
#в последней команде ввести пароль qwerty123

или становить сертификат от letsencrypt:
Сгенерировать сертификат с паролем:
openssl pkcs12 -inkey privkey.pem -in fullchain.pem -export -out privkeywithpassword.pfx
#в последней команде ввести пароль qwerty123

Статистика по курсам валют тут
https://openexchangerates.org/account



CREATE EXTENSION hstore;

Добавить поддержку:
https://ebay.com/p/6017012255?iid=326024002095
https://www.ebay.com/itm/175893251126?tool_productId=084b0333-f829-429b-a5ff-562a3689a18b


Иконки
https://icones.js.org/collection/oi