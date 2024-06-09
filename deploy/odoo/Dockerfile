# Используем официальный образ Odoo
FROM odoo:17.0

# Установка Apache
RUN apt-get update && apt-get install -y apache2 apache2-utils

# Установка Certbot для получения сертификатов
RUN apt-get install -y certbot python3-certbot-apache

# Копирование конфигурационных файлов Apache
COPY apache/odoo.conf /etc/apache2/sites-available/odoo.conf
COPY apache/000-default.conf /etc/apache2/sites-available/000-default.conf

# Включение модулей Apache
RUN a2enmod proxy proxy_http ssl

# Включение конфигураций сайтов Apache
RUN a2ensite odoo
RUN a2ensite 000-default

# Обеспечение запуска Apache и Odoo
CMD ["sh", "-c", "service apache2 start && odoo"]
