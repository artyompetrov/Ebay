
Инструкция по настройке автодеплоя:
https://www.youtube.com/watch?v=f5AlQE0i5m0&ab_channel=Programonaut

Генерация сертификата
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.cert -sha256 -days 3650
openssl pkcs12 -inkey key.pem -in cert.cert -export -out pfx.pfx