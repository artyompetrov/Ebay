import os
import requests
import shutil
import subprocess
from datetime import datetime
import time
from typing import Optional
from requests.auth import HTTPBasicAuth
from getpass import getpass
from pathlib import Path
from urllib.parse import urlencode
import re

# Конфигурационные переменные
from_host: Optional[str] = os.getenv("EBAY_HELPER_REMOTE_HOST")
if from_host is None:
    raise EnvironmentError("EBAY_HELPER_REMOTE_HOST environment variable is required")
    
to_host = "localhost"
backup_path_folder = r"C:\Users\APETROV\files\yandex.disk\YandexDisk\Backups\Ebay"

pg_password = "catnip0-spoil4-untrimmed"
remote_pg_password: Optional[str] = os.getenv("EBAY_HELPER_REMOTE_PG_PASSWORD")
if remote_pg_password is None:
    raise EnvironmentError("EBAY_HELPER_REMOTE_PG_PASSWORD environment variable is required")

# далее бекап

os.environ["PGPASSWORD"] = remote_pg_password

backup_path = os.path.join(backup_path_folder, datetime.now().strftime('%Y-%m-%d-%H-%M-%S'))
Path(backup_path).mkdir(parents=True, exist_ok=True)

# Создание бэкапов
print("!!! creating backups")

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

print("!!! pulling containers")
subprocess.run(["docker-compose", "-f", "./deploy/docker-compose.yaml", "--env-file", "./deploy/localhost.env", "pull"])

# Запуск контейнеров
print("!!! starting containers with RESTORE option")
subprocess.run(["docker-compose", "-f", "./deploy/docker-compose.yaml", "--env-file", "./deploy/localhost.env", "up", "-d"], env={"RESTORE": "true"})
time.sleep(5)

# Переключаем пароль для локальной базы данных
os.environ["PGPASSWORD"] = pg_password

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

# Удаление локальных баз данных
print("!!! dropping local databases")
subprocess.run([
    r"C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "--host", to_host,
    "--port", "15432",
    "--username", "ebay",
    "--dbname", "postgres",
    "--command", 'TRUNCATE TABLE "Keys";'
])
subprocess.run([
    r"C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "--host", to_host,
    "--port", "15432",
    "--username", "ebay",
    "--dbname", "postgres",
    "--command", 'TRUNCATE TABLE "PersistedGrants";'
])
time.sleep(5)

print("!!! starting containers")
subprocess.run(["docker-compose", "-f", "./deploy/docker-compose.yaml", "--env-file", "./deploy/localhost.env", "up", "-d"])
time.sleep(5)

print("Backup files are in folder:", backup_path)
