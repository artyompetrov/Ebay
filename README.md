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

Проблемные:
какая-то ошибка https://www.ebay.com/itm/314906987538?hash=item4951eb4c12:g:EjgAAOSwtBtlNlho&amdata=enc%3AAQAIAAAA4Gik0%2BLeD3QTLceU5JuIpMgqqXvg1ydu61SL0bqgQRGir%2FaqpNcD26lkCqkoJydKfshFUBiJkT5Qvkjc4WpNbz2e8Qe5CvCE5x%2FppuczwSDAEaWzp9H8o8lm9CWQ3%2FgHREUDokwYVBhb%2BmZl9CdNIZCSDTMGaVq1tSYADjsOmsC3%2ByDhwSe6NA%2B88Hap7o6SgqSQa9nvJbrsSXgsuaeToLBHI5n1aB0luDVMExR3vwm9XtrWu6mRmH71u%2F6vDSihUKnMbjBfBed%2BYX6I%2B7voiF8lrmVgBkhuOyJ03ECVMSJh%7Ctkp%3ABk9SR6zG1fSpYw

Отстуствует доставка в германию https://www.ebay.com/itm/332803698406?hash=item4d7ca56ee6:g:zgIAAOSwhexcM4m6&amdata=enc%3AAQAIAAAAwLDOS%2Bb9Sv8NNLkPq1uOpb7PccFxwmE76QoMijoKPWPYSkjo%2FXNT0WHQhLftTPhrkrB8j%2FcagjW2L6nwh0ZCeZ8TvJzxCnA62wvX6Si85rbxHb1QIq1wbAYKWGMYjNUubBsXH7W7QXLTk6QoKF9gq3Ysrz2IZNkui0hS5J3nDSYy1AxlxZKOEoewSTQay1cbElMjIsooDiYwZa7HCZSEnaOS8Z4PjmtcvmfYSbae2UPoDa5OkAn0ykNJZmQukJY1uA%3D%3D%7Ctkp%3ABk9SR9jBs9OlYw

https://www.ebay.com/itm/225590176801?hash=item348638ec21:g:T9sAAOSwKXVlAfv-&amdata=enc%3AAQAIAAAAwMjLzRXKU4dByOX9486ZvbEGBfgVB63UYLO%2Bhgs8iektXrO5zjaachBq25UfLAJ4wHXKtryyhmE0fbTjZKx5x0GNS99%2BZ1V%2F66SbsB%2F1%2BiKaLmi6wybDwG03PWw%2BsUi2bQXhZhOFvNLS6yny9z3AyAXp9fdTkWtQzTqyL0KD%2Fd%2BsKYoY9gG9Loxf1jBfYd4oFOnvYbKfxVG%2Ff28M0o0XIFbOszCLJMpz3jYkW1etpmNgDCNXAc0U515NewObK9fXhQ%3D%3D%7Ctkp%3ABk9SR67G1fSpYw

добавить множество поисковых запросов

todo поправить в базе 9999 shipping