#!/bin/sh
set -eu

if [ "${XUI_ENABLE_FAIL2BAN:-false}" = "true" ]; then
  fail2ban-client -x start || true
fi

if [ -n "${XUI_WEB_PORT:-}" ]; then
  /app/x-ui setting -port "${XUI_WEB_PORT}" >/dev/null 2>&1 || true
fi

if [ -n "${XUI_ADMIN_USERNAME:-}" ] && [ -n "${XUI_ADMIN_PASSWORD:-}" ]; then
  /app/x-ui setting -username "${XUI_ADMIN_USERNAME}" -password "${XUI_ADMIN_PASSWORD}" >/dev/null 2>&1 || true
fi

if [ -n "${XUI_WEB_BASE_PATH:-}" ]; then
  /app/x-ui setting -webBasePath "${XUI_WEB_BASE_PATH}" >/dev/null 2>&1 || true
fi

exec /app/x-ui
