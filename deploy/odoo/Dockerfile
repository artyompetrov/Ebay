# Используем официальный образ Odoo
FROM odoo:17.0

USER root

# Установка Apache
RUN apt-get update && apt-get install -y apache2 apache2-utils

# Копирование конфигурационных файлов Apache
COPY apache/odoo.conf /etc/apache2/sites-available/odoo.conf
COPY apache/000-default.conf /etc/apache2/sites-available/000-default.conf

# Включение модулей Apache
RUN a2enmod proxy proxy_http ssl rewrite

# Включение конфигураций сайтов Apache
RUN a2ensite odoo
RUN a2ensite 000-default

# Создание необходимых директорий и установка прав доступа
RUN mkdir -p /var/run/apache2 /var/lock/apache2
RUN chown -R www-data:www-data /var/run/apache2 /var/lock/apache2

USER odoo

# Обеспечение запуска Apache и Odoo
CMD ["sh", "-c", "service apache2 start && odoo"]