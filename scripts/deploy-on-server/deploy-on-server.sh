#!/bin/bash

# Stop on the first failed step, so a failed pull never leads to "down" and the deploy job goes red.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_DIR/deploy"

docker compose --env-file server.env pull
docker compose --env-file server.env down
docker compose --env-file server.env up -d --no-build
docker image prune -f
