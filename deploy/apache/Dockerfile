FROM httpd:2.4

WORKDIR /usr/local/bin/

COPY start-apache.sh start-apache.sh

RUN chmod +x start-apache.sh && \
    apt update && \
    apt install -y apache2 gettext-base && \
    apt clean && \
    a2enmod rewrite proxy ssl


ENTRYPOINT ["start-apache.sh"]