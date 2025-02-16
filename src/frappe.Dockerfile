FROM frappe/erpnext:v15.51.1

COPY ./frappe_ebay/ ./frappe-bench/

RUN ./env/bin/pip install -q -U -e ./apps/ebay && \
     bench build --app ebay