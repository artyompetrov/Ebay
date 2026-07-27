#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

run_step() {
  local title="$1"
  shift
  echo
  echo "==== $title ===="
  "$@"
}

run_step "Build backend" bash -lc "cd '$ROOT_DIR/src/Ebay' && dotnet build"
run_step "Run backend tests" bash -lc "cd '$ROOT_DIR/src/Ebay' && dotnet test --no-build"
run_step "Run frontend JavaScript tests" bash -lc "node --test '$ROOT_DIR'/src/Ebay/Frontend/Tests/*.test.mjs"
run_step "Install Chrome extension dependencies" bash -lc "cd '$ROOT_DIR/src/ChromeExtension' && npm ci"
run_step "Build Chrome extension" bash -lc "cd '$ROOT_DIR/src/ChromeExtension' && npm run build"

echo

echo "All agent checks passed."
