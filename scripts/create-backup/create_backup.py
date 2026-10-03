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
import socket

repo_root = Path(__file__).resolve().parent.parent.parent
docker_compose_file = str(repo_root / "deploy" / "docker-compose.yaml")
docker_compose_env_file = str(repo_root / "deploy" / "localhost.env")

# Конфигурационные переменные
from_host: Optional[str] = os.getenv("EBAY_HELPER_BACKEND_DOMAIN")
if from_host is None:
    raise EnvironmentError("EBAY_HELPER_BACKEND_DOMAIN environment variable is required")
    
# Postgres на сервере слушает только 127.0.0.1, поэтому к нему ходим через SSH-туннель
ssh_user: Optional[str] = os.getenv("EBAY_HELPER_SSH_USER")
if ssh_user is None:
    raise EnvironmentError("EBAY_HELPER_SSH_USER environment variable is required")

tunnel_port = 25432  # локальный порт туннеля, не пересекается с локальной БД на 15432

to_host = "localhost"
backup_path_folder = r"C:\Users\APETROV\files\yandex.disk\YandexDisk\Backups\Ebay"

pg_password = "catnip0-spoil4-untrimmed"
remote_pg_password: Optional[str] = os.getenv("EBAY_HELPER_PG_PASSWORD")
if remote_pg_password is None:
    raise EnvironmentError("EBAY_HELPER_PG_PASSWORD environment variable is required")

# далее бекап

os.environ["PGPASSWORD"] = remote_pg_password

backup_path = os.path.join(backup_path_folder, datetime.now().strftime('%Y-%m-%d-%H-%M-%S'))
Path(backup_path).mkdir(parents=True, exist_ok=True)

def wait_for_port(port: int, timeout: float = 15) -> None:
    deadline = time.monotonic() + timeout
    while True:
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=1):
                return
        except OSError:
            if time.monotonic() > deadline:
                raise TimeoutError(f"SSH tunnel on port {port} did not come up")
            time.sleep(0.5)


# Создание бэкапов
print("!!! creating backups")
print("!!! opening SSH tunnel")
tunnel = subprocess.Popen([
    "ssh", "-N",
    "-o", "ExitOnForwardFailure=yes",
    "-o", "BatchMode=yes",
    "-L", f"{tunnel_port}:127.0.0.1:15432",
    f"{ssh_user}@{from_host}"
])

extensions_backup_file_ebay = os.path.join(backup_path, "extensions_ebay.sql")
try:
    wait_for_port(tunnel_port)

    # Бэкап Ebay
    print("!!! backing up ebay_helper")
    with open(extensions_backup_file_ebay, 'w') as extensions_file:
        subprocess.run([
            r"C:\Program Files\PostgreSQL\16\bin\psql.exe",
            "--host", "localhost",
            "--port", str(tunnel_port),
            "--username", "ebay",
            "--dbname", "ebay",
            "--command", "COPY (SELECT 'CREATE EXTENSION IF NOT EXISTS ' || extname || ';' FROM pg_extension) TO STDOUT;"
        ], stdout=extensions_file, check=True)

    subprocess.run([
        r"C:\Program Files\PostgreSQL\16\bin\pg_dump.exe",
        "--verbose",
        "--host", "localhost",
        "--port", str(tunnel_port),
        "--username", "ebay",
        "--format=c",
        "--compress=6",
        "--file", os.path.join(backup_path, "ebay"),
        "ebay"
    ], check=True)
finally:
    print("!!! closing SSH tunnel")
    tunnel.terminate()

# Остановка контейнеров
print("!!! stopping containers")
subprocess.run(["docker-compose", "-f", docker_compose_file, "--env-file", docker_compose_env_file, "down", "-v"])

print("!!! pulling containers")
subprocess.run(["docker-compose", "-f", docker_compose_file, "--env-file", docker_compose_env_file, "pull"])

# Запуск контейнеров
print("!!! starting containers with RESTORE option")
subprocess.run(["docker-compose", "-f", docker_compose_file, "--env-file", docker_compose_env_file, "up", "-d"], env={"RESTORE": "true"})
time.sleep(5)

# Переключаем пароль для локальной базы данных
os.environ["PGPASSWORD"] = pg_password

# Остановка сервиса ebay_helper перед удалением локальных баз данных
print("!!! stopping ebay_helper")
subprocess.run(["docker", "container", "stop", "ebay_helper"], check=False)
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

print("!!! starting containers")
subprocess.run(["docker-compose", "-f", docker_compose_file, "--env-file", docker_compose_env_file, "up", "-d"])
time.sleep(5)

# Остановка сервиса ebay_helper перед удалением локальных баз данных
print("!!! stopping ebay_helper")
subprocess.run(["docker", "container", "stop", "ebay_helper"], check=False)
time.sleep(5)

print("Backup files are in folder:", backup_path)
