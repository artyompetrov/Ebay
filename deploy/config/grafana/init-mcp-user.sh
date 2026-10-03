#!/bin/sh
# Idempotently creates a read-only (Viewer) Grafana user for the Grafana MCP server.
# Grafana 10 can't provision users/service accounts declaratively, so this runs against the HTTP API.
set -eu

if [ -z "${MCP_PASSWORD:-}" ]; then
  echo "GRAFANA_MCP_PASSWORD is empty, skipping MCP user setup"
  exit 0
fi

BASE="http://ebay_grafana:3000"
ADMIN="${GRAFANA_ADMIN_USER}:${GRAFANA_ADMIN_PASSWORD}"
LOGIN="${MCP_LOGIN:-mcp}"

until curl -fsS "$BASE/api/health" >/dev/null; do
  echo "Waiting for Grafana..."
  sleep 2
done

body="{\"name\":\"$LOGIN\",\"login\":\"$LOGIN\",\"password\":\"$MCP_PASSWORD\"}"
code=$(curl -sS -o /tmp/resp -w '%{http_code}' -u "$ADMIN" -H 'Content-Type: application/json' \
  -X POST "$BASE/api/admin/users" -d "$body")

if [ "$code" = "200" ]; then
  id=$(sed -n 's/.*"id":\([0-9]*\).*/\1/p' /tmp/resp)
  echo "Created user $LOGIN (id=$id)"
elif [ "$code" = "412" ]; then
  id=$(curl -fsS -u "$ADMIN" "$BASE/api/users/lookup?loginOrEmail=$LOGIN" | sed -n 's/.*"id":\([0-9]*\).*/\1/p')
  curl -fsS -u "$ADMIN" -H 'Content-Type: application/json' -X PUT \
    "$BASE/api/admin/users/$id/password" -d "{\"password\":\"$MCP_PASSWORD\"}" >/dev/null
  echo "User $LOGIN (id=$id) already exists, password synced"
else
  echo "Failed to create user: HTTP $code"
  cat /tmp/resp
  exit 1
fi

# New users get the org default role; force Viewer in the main org.
curl -fsS -u "$ADMIN" -H 'Content-Type: application/json' -X PATCH \
  "$BASE/api/org/users/$id" -d '{"role":"Viewer"}' >/dev/null
echo "Role set to Viewer"
