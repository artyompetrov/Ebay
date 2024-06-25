#!/bin/bash

set -e
set -u

function create() {
	local user=$1
	echo "  Creating user '$user'"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	    CREATE USER $user WITH PASSWORD '$POSTGRES_PASSWORD' CREATEDB;
EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_USERS" ]; then
	echo "Multiple user creation requested: $POSTGRES_MULTIPLE_USERS"
	for user in $(echo $POSTGRES_MULTIPLE_USERS | tr ',' ' '); do
		create $user
	done
	echo "Multiple users created"
fi