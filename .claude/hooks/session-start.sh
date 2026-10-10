#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

REPO_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
export REPO_DIR

source "$REPO_DIR/scripts/cloud-agent-init/init.sh"

if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  {
    echo "export DOTNET_ROOT=/opt/dotnet"
    echo 'export PATH="/opt/dotnet:$PATH:$HOME/.dotnet/tools"'
    # Anonymous Docker Hub pulls from the shared sandbox egress IP hit 429 rate limits;
    # Testcontainers (Postgres + Ryuk images) pulls through Google's Docker Hub mirror instead.
    echo "export TESTCONTAINERS_HUB_IMAGE_NAME_PREFIX=mirror.gcr.io"
  } >> "$CLAUDE_ENV_FILE"
fi
