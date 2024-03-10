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


items per lot https://www.ebay.com/itm/265714851078?_trkparms=amclksrc%3DITM%26aid%3D1110006%26algo%3DHOMESPLICE.SIM%26ao%3D1%26asc%3D20231107084023%26meid%3Dcb7815a1148742849feab81bb5dc9c0a%26pid%3D101875%26rk%3D4%26rkt%3D4%26sd%3D256430642070%26itm%3D265714851078%26pmt%3D1%26noa%3D0%26pg%3D4429486%26algv%3DSimplAMLv11WebTrimmedV3MskuWithLambda85KnnRecallV1V2V4ItemNrtInQueryAndCassiniVisualRankerAndBertRecallWithVMEV3CPCAutoWithCassiniEmbRecall%26brand%3DVoskhod&_trksid=p4429486.c101875.m1851&itmprp=cksum%3A265714851078cb7815a1148742849feab81bb5dc9c0a%7Cenc%3AAQAIAAABcHD%252FO%252BVoFoPPIoZ2g0kOZxWd85mWuIHekSp3qag7zFfwObZeQoitzE%252FDCfcejfO%252BzOLmzZmy11RrgWpA56KM9DpasK%252BGtGYwCFvgaK6ijP5AqShEUhT8f2oX6hvndJ3G0oWH8DD1DlBWseQltpxcSDW2Uu52NrseaxeINpsrDP6vx7ny%252BkPKauMa3yeSanWiityEzbJGYOF4o%252BUPuB7C9fkbCO4HymMbs%252BD3UC%252FHv4ZJHUB29sBSa10R8Bad8NO8uSYJiCcsFwKV0ApjrCUeBbRZSf1Eqm%252BGYTCc3HvtYFPuV93i0uHXKBnyyAvPAXRdo3vWpbNgnNgCNawCK9MyKidttdJjR8aCtekZY9tAXbCAtOh1ABAaXaB45Erln%252Bsy3kvhtho94REaWlFrJuokWM6cLf3%252Fe5FinSebTCETLtX8qcUJ3qsH1ollNtZXYL5yMTZu%252Fuq%252BV28c6RPJJeQ74Dk%252FIj%252B0sqY2NOZWFygnOBRY%7Campid%3APL_CLK%7Cclp%3A4429486&itmmeta=01HRKV6B1W5PPX4MG9YC363KDZ