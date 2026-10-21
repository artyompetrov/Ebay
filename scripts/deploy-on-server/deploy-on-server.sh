#!/bin/bash
# Updates the server's checkout of the repo to origin/main and redeploys the containers.
#
# Run it from inside that checkout. The CI deploy job pipes this file over SSH from its own checkout
# (`cd <checkout> && bash -c "$(cat)" < deploy-on-server.sh`), so the version from the commit being deployed runs,
# not the one still on the server. By hand on the server: `cd <checkout> && bash scripts/deploy-on-server/deploy-on-server.sh`.

# Stop on the first failed step: a failed fetch or pull must fail the deploy, not redeploy stale files.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

git fetch origin main
git reset --hard origin/main
git clean -fd

cd deploy

docker compose --env-file server.env pull
docker compose --env-file server.env down
docker compose --env-file server.env up -d --no-build
docker image prune -f
