import os
import requests
import shutil
import subprocess
from datetime import datetime
import time
from requests.auth import HTTPBasicAuth
from getpass import getpass
from pathlib import Path
from urllib.parse import urlencode

# Конфигурационные переменные
from_host = "naks42.ru"
to_host = "localhost"
backup_path_folder = "D:\YandexDisk\Backups\Ebay"

pg_password = "catnip0-spoil4-untrimmed"
odoo_master_password = "4i5x-j7ub-ug2p"

# далее бекап

os.environ["PGPASSWORD"] = pg_password

backup_path = os.path.join(backup_path_folder, datetime.now().strftime('%Y-%m-%d-%H-%M-%S'))
Path(backup_path).mkdir(parents=True, exist_ok=True)

odoo_backup_url = f"https://{from_host}/web/database/backup"
odoo_restore_url = f"https://{to_host}/web/database/restore"

# Создание бэкапов
print("!!! creating backups")

# Бэкап Odoo
print("!!! backing up odoo")
odoo_backup_params = {
    "master_pwd": odoo_master_password,
    "name": "odoo",
    "backup_format": "zip"
}

odoo_backup_response = requests.post(
    odoo_backup_url,
    data=urlencode(odoo_backup_params),
    headers={"Content-Type": "application/x-www-form-urlencoded"},
    verify=False
)

if odoo_backup_response.status_code == 200:
    with open(os.path.join(backup_path, "odoo.zip"), 'wb') as f:
        f.write(odoo_backup_response.content)
else:
    print("Failed to back up Odoo. Status code:", odoo_backup_response.status_code)
    print("Response:", odoo_backup_response.text)

# Бэкап Ebay
print("!!! backing up ebay_helper")
extensions_backup_file_ebay = os.path.join(backup_path, "extensions_ebay.sql")
subprocess.run([
    r"C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "--host", from_host,
    "--port", "15432",
    "--username", "ebay",
    "--dbname", "ebay",
    "--command", "COPY (SELECT 'CREATE EXTENSION IF NOT EXISTS ' || extname || ';' FROM pg_extension) TO STDOUT;"
], stdout=open(extensions_backup_file_ebay, 'w'))

subprocess.run([
    r"C:\Program Files\PostgreSQL\16\bin\pg_dump.exe",
    "--verbose",
    "--host", from_host,
    "--port", "15432",
    "--username", "ebay",
    "--format=c",
    "--compress=6",
    "--file", os.path.join(backup_path, "ebay"),
    "-n", "public",
    "ebay"
])

# Остановка контейнеров
print("!!! stopping containers")
subprocess.run(["docker-compose", "-f", "./deploy/docker-compose.yaml", "--env-file", "./deploy/localhost.env", "down", "-v"])

# Запуск контейнеров
print("!!! starting containers")
subprocess.run(["docker-compose", "-f", "./deploy/docker-compose.yaml", "--env-file", "./deploy/localhost.env", "up", "-d"])
time.sleep(5)

print("!!! stoping ebay_server")
subprocess.run(["docker", "container", "stop", "ebay_server"])
time.sleep(5)

# Удаление локальных баз данных
print("!!! dropping local databases")
subprocess.run([
    r"C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "--host", to_host,
    "--port", "15432",
    "--username", "ebay",
    "--dbname", "postgres",
    "--command", "DROP DATABASE IF EXISTS ebay WITH (FORCE);"
])
time.sleep(5)
subprocess.run([
    r"C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "--host", to_host,
    "--port", "15432",
    "--username", "ebay",
    "--dbname", "postgres",
    "--command", "CREATE DATABASE ebay;"
])
time.sleep(5)

# Восстановление бэкапов локально
print("!!! restoring backups locally")
subprocess.run([
    r"C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "--host", to_host,
    "--port", "15432",
    "--username", "ebay",
    "--dbname", "ebay",
    "--file", extensions_backup_file_ebay
])
time.sleep(5)
subprocess.run([
    r"C:\Program Files\PostgreSQL\16\bin\pg_restore.exe",
    "--verbose",
    "--host", to_host,
    "--port", "15432",
    "--username", "ebay",
    "--dbname", "ebay",
    "--format=c",
    os.path.join(backup_path, "ebay")
])
time.sleep(5)

# Восстановление Odoo
print("!!! restoring odoo")
odoo_restore_params = {
    "master_pwd": odoo_master_password,
    "name": "odoo",
    "neutralize_database": "on",
    "copy": "true"
}

odoo_backup_file = os.path.join(backup_path, "odoo.zip")
with open(odoo_backup_file, 'rb') as f:
    files = {'backup_file': f}
    odoo_restore_response = requests.post(
        odoo_restore_url,
        data=odoo_restore_params,
        files=files,
        verify=False
    )

if odoo_restore_response.status_code == 200:
    print("Odoo restored successfully.")
else:
    print("Failed to restore Odoo. Status code:", odoo_restore_response.status_code)
    print("Response:", odoo_restore_response.text)
    
# Запуск контейнеров
print("!!! starting ebay_server")
subprocess.run(["docker", "container", "start", "ebay_server"])

print("Backup files are in folder:", backup_path)
