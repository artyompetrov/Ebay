#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

REPO_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

# --- PostgreSQL ---
if ! dpkg -s postgresql-16 >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y postgresql-16
fi

sudo mkdir -p /etc/postgresql/16/main/conf.d
echo "port = 15432" | sudo tee /etc/postgresql/16/main/conf.d/port.conf >/dev/null

if ! pg_lsclusters | awk '$1=="16" && $2=="main" {print $4}' | grep -qx online; then
  sudo pg_ctlcluster 16 main start
fi

sudo -u postgres psql -v ON_ERROR_STOP=1 <<'SQL'
     DO $$
     BEGIN
       IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='ebay') THEN
         CREATE ROLE ebay LOGIN PASSWORD 'catnip0-spoil4-untrimmed';
       ELSE
         ALTER ROLE ebay WITH LOGIN PASSWORD 'catnip0-spoil4-untrimmed';
       END IF;
     END
     $$;
     SELECT 'CREATE DATABASE ebay OWNER ebay'
     WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname='ebay')\gexec
     ALTER ROLE ebay CREATEROLE CREATEDB;
SQL

# --- .NET SDK ---
DOTNET_DIR=/opt/dotnet
if [ ! -x "$DOTNET_DIR/dotnet" ]; then
  mkdir -p "$DOTNET_DIR"
  wget -q https://dot.net/v1/dotnet-install.sh -O /tmp/dotnet-install.sh
  chmod +x /tmp/dotnet-install.sh
  /tmp/dotnet-install.sh --channel 10.0 --install-dir "$DOTNET_DIR"
fi

if [ ! -f /etc/profile.d/dotnet.sh ]; then
  sudo tee /etc/profile.d/dotnet.sh >/dev/null <<'EOF'
export DOTNET_ROOT=/opt/dotnet
export PATH="$DOTNET_ROOT:$PATH"
export PATH="$PATH:$HOME/.dotnet/tools"
EOF
fi

export DOTNET_ROOT=/opt/dotnet
export PATH="$DOTNET_ROOT:$PATH:$HOME/.dotnet/tools"

if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  {
    echo "export DOTNET_ROOT=/opt/dotnet"
    echo 'export PATH="/opt/dotnet:$PATH:$HOME/.dotnet/tools"'
  } >> "$CLAUDE_ENV_FILE"
fi

if ! command -v dotnet-ef >/dev/null 2>&1; then
  dotnet tool install --global dotnet-ef --version 10.0.0
fi

cd "$REPO_DIR/src/Ebay" && dotnet restore
cd "$REPO_DIR/src/ChromeExtension" && npm install
cd "$REPO_DIR"

pg_lsclusters
dotnet --version
