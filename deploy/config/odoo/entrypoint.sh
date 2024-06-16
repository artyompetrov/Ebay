#!/bin/bash

set -e

if [ -v PASSWORD_FILE ]; then
    PASSWORD="$(< $PASSWORD_FILE)"
fi

# set the postgres database host, port, user and password according to the environment
# and pass them as arguments to the odoo process if not present in the config file
: ${HOST:=${DB_PORT_5432_TCP_ADDR:='db'}}
: ${PORT:=${DB_PORT_5432_TCP_PORT:=5432}}
: ${USER:=${DB_ENV_POSTGRES_USER:=${POSTGRES_USER:='odoo'}}}
: ${PASSWORD:=${DB_ENV_POSTGRES_PASSWORD:=${POSTGRES_PASSWORD:='odoo'}}}

DB_ARGS=()
function check_config() {
    param="$1"
    value="$2"
    if grep -q -E "^\s*\b${param}\b\s*=" "$ODOO_RC" ; then       
        value=$(grep -E "^\s*\b${param}\b\s*=" "$ODOO_RC" |cut -d " " -f3|sed 's/["\n\r]//g')
    fi;
    DB_ARGS+=("--${param}")
    DB_ARGS+=("${value}")
}
check_config "db_host" "$HOST"
check_config "db_port" "$PORT"
check_config "db_user" "$USER"
check_config "db_password" "$PASSWORD"

# Функция для проверки существования таблицы в базе данных
check_db_exists() {
    # Проверка существования базы данных
    
    if PGPASSWORD=${PASSWORD} psql -h "$HOST" -p "$PORT" -U "$USER" -lqt | cut -d \| -f 1 | grep -qw "$DATABASE"; then
        echo "Database '$DATABASE' exists"
        return 0 #success
    else
        echo "Database '$DATABASE' doesn't exists"
        return 1 #not success
    fi
}

wait-for-psql.py ${DB_ARGS[@]} --timeout=30

# Если база данных не содержит таблиц, выполнить инициализацию
if check_db_exists; then
  echo "Database already initialized."
  exec odoo "$@" "${DB_ARGS[@]}"
else
  echo "Initializing database..."
  odoo -d ${DATABASE} -i base --db_host=${HOST} --db_user=${USER} --db_password=${PASSWORD}
fi
