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
import re

# Конфигурационные переменные
from_host = "tubessale.ddns.net"
to_host = "localhost"
backup_path_folder = r"D:\YandexDisk\Backups\Ebay"

pg_password = "catnip0-spoil4-untrimmed"

# далее бекап

os.environ["PGPASSWORD"] = pg_password

backup_path = os.path.join(backup_path_folder, datetime.now().strftime('%Y-%m-%d-%H-%M-%S'))
Path(backup_path).mkdir(parents=True, exist_ok=True)
frappe_backup_path = os.path.join(backup_path, "frappe")
Path(frappe_backup_path).mkdir(parents=True, exist_ok=True)

# Создание бэкапов
print("!!! creating backups")

print("Frappe backups")
print("Removing old backups on host")
subprocess.run([
    r"ssh",
    "root@" + from_host,
    "rm",
    "-drf",
    "/tmp/bkp/"
], timeout = 5)

print("Removing old backups inside container")
subprocess.run([
    r"ssh",
    "root@" + from_host,
    "docker",
    "exec",
    "ebay_frappe_backend",
    "rm",
    "-drf",
    "/tmp/bkp/"
])

print("Creating new backup")
subprocess.run([
    r"ssh",
    "root@" + from_host,
    "docker",
    "exec",
    "ebay_frappe_backend",
    "bench",
    "--site",
    from_host,
    "backup",
    "--with-files",
    "--compress",
    "--backup-path",
    "/tmp/bkp/"
])

print("Copy backup to host")
subprocess.run([
    r"ssh",
    "root@" + from_host,
    "docker",
    "cp",
    "ebay_frappe_backend:/tmp/bkp/",
    "/tmp/bkp/"
])

print("Copy to yandex disk")
subprocess.run([
    "scp",
    "-r",
    "root@" + from_host + ":/tmp/bkp/*",
    frappe_backup_path
])


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

print("frappe restore")

sql_pattern = re.compile(r".*-database\.sql\.gz$")
public_pattern = re.compile(r".*-files\.tgz$")
private_pattern = re.compile(r".*-private-files\.tgz$")

sql_file = public_files = private_files = None

for file in os.listdir(frappe_backup_path):
    full_path = os.path.join(frappe_backup_path, file)

    if not os.path.isfile(full_path):
        continue

    if sql_pattern.match(file):
        sql_file = full_path
    elif private_pattern.match(file):
        private_files = full_path
    elif public_pattern.match(file):
        public_files = full_path

print("SQL File:", sql_file)
print("Public Files:", public_files)
print("Private Files:", private_files)

print("Copy backup to local docker container")
subprocess.run([
    "docker",
    "cp",
    sql_file,
    "ebay_frappe_backend:/tmp/sql_file.sql.gz"
], timeout=10)
subprocess.run([
    "docker",
    "cp",
    public_files,
    "ebay_frappe_backend:/tmp/public_files.tgz"
], timeout=10)
subprocess.run([
    "docker",
    "cp",
    private_files,
    "ebay_frappe_backend:/tmp/private_files.tgz"
], timeout=10)

subprocess.run([
    "docker",
    "exec",
    "ebay_frappe_backend",
    "bench",
    "new-site",
    "--mariadb-user-host-login-scope=%",
    "--admin-password="+pg_password,
    "--db-root-username=root",
    "--db-root-password="+pg_password,
    "--set-default",
    "localhost"
])

subprocess.run([
    "docker",
    "exec",
    "ebay_frappe_backend",
    "bench",
    "--site",
    "localhost",
    "--force",
    "restore",
    "/tmp/sql_file.sql.gz",
    "--with-public-files",
    "/tmp/public_files.tgz",
    "--with-private-files",
    "/tmp/private_files.tgz",
    "--db-root-password",
    pg_password
])

print("!!! starting containers")
subprocess.run(["docker-compose", "-f", "./deploy/docker-compose.yaml", "--env-file", "./deploy/localhost.env", "up", "-d"])
time.sleep(5)

print("Backup files are in folder:", backup_path)