FROM odoo:17.0

USER root
RUN apt-get update && apt-get install -y locales && locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Скопировать объединенный скрипт в контейнер
COPY entrypoint.sh /entrypoint.sh

# Сделать скрипт исполняемым
RUN chmod +x /entrypoint.sh

# Установить точку входа
ENTRYPOINT ["/entrypoint.sh"]
