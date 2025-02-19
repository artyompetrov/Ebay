FROM frappe/erpnext:v15.51.1

COPY  --chown=frappe:frappe ./frappe_ebay/ ./apps/ebay/

RUN ls -1 apps > sites/apps.txt
RUN ./env/bin/pip install -q -U -e ./apps/ebay
RUN bench build