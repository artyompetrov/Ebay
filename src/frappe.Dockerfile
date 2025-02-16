FROM frappe/erpnext:v15.51.1

COPY ./frappe_ebay/ ./apps/ebay/

RUN  ls -1 apps > sites/apps.txt && \
     ./env/bin/pip install -q -U -e ./apps/ebay && \
     bench build