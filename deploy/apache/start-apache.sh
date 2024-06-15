#!/bin/bash

# Используем envsubst для замены переменных окружения в конфигурационном файле
envsubst < /etc/apache2/sites-available/000-default.conf.template > /etc/apache2/sites-available/000-default.conf

# Запускаем Apache
httpd-foreground