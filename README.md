Инструкция по настройке автодеплоя:
https://www.youtube.com/watch?v=f5AlQE0i5m0&ab_channel=Programonaut

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

# в последней команде ввести пароль qwerty123

про возврат кодов отличных от
200 https://stackoverflow.com/questions/41464540/returning-a-404-from-an-explicitly-typed-asp-net-core-api-controller-not-iactio

todo лоты что игноририруем не надо заполнять
todo https://www.ebay.com/itm/332803698406?hash=item4d7ca56ee6:g:zgIAAOSwhexcM4m6&amdata=enc%3AAQAIAAAAwLDOS%2Bb9Sv8NNLkPq1uOpb7PccFxwmE76QoMijoKPWPYSkjo%2FXNT0WHQhLftTPhrkrB8j%2FcagjW2L6nwh0ZCeZ8TvJzxCnA62wvX6Si85rbxHb1QIq1wbAYKWGMYjNUubBsXH7W7QXLTk6QoKF9gq3Ysrz2IZNkui0hS5J3nDSYy1AxlxZKOEoewSTQay1cbElMjIsooDiYwZa7HCZSEnaOS8Z4PjmtcvmfYSbae2UPoDa5OkAn0ykNJZmQukJY1uA%3D%3D%7Ctkp%3ABk9SR9jBs9OlYw