# Используем официальный образ Odoo
FROM odoo:17.0

USER root
RUN chmod 777 /var/lib/apt/lists /var/lib/apt/lists/partial

# Установка Apache
RUN apt-get update && apt-get install -y apache2 apache2-utils

# Копирование конфигурационных файлов Apache
COPY apache/odoo.conf /etc/apache2/sites-available/odoo.conf
COPY apache/000-default.conf /etc/apache2/sites-available/000-default.conf

# Включение модулей Apache
RUN a2enmod proxy proxy_http ssl

# Включение конфигураций сайтов Apache
RUN a2ensite odoo
RUN a2ensite 000-default

USER odoo

# Обеспечение запуска Apache и Odoo
CMD ["sh", "-c", "service apache2 start && odoo"]
