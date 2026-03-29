#!/bin/sh
set -eu

if [ "${XUI_ENABLE_FAIL2BAN:-false}" = "true" ]; then
  fail2ban-client -x start || true
fi

if [ -n "${XUI_WEB_BASE_PATH:-}" ]; then
  /app/x-ui setting -webBasePath "${XUI_WEB_BASE_PATH}" >/dev/null 2>&1 || true
fi

exec /app/x-ui
