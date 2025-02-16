FROM frappe/erpnext:v15.51.1

COPY ./frappe_ebay/ ./apps/ebay/

RUN  chown -R frappe:frappe ./apps/ebay && \
     chmod -R 777 ./apps/ebay && \
     ls -1 apps > sites/apps.txt && \
     ./env/bin/pip install -q -U -e ./apps/ebay && \
     bench build