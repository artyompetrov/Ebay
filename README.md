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

# todo:
todo поправить в базе 9999 shipping


инструкция как удалить красную страницу
https://chromium.googlesource.com/chromium/src/+/master/docs/security/lookalikes/lookalike-domains.md