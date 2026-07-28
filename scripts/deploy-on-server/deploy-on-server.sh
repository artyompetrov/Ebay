#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_DIR/deploy" || exit 1

docker compose --env-file server.env pull
docker compose --env-file server.env down
docker compose --env-file server.env up -d
docker image prune -f
