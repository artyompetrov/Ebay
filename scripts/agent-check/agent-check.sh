#!/usr/bin/env bash
# Pre-PR check. Run it with `make agent-check`: the Makefile picks the interpreter (Git Bash on Windows)
# and starts it as a login shell, so the environment comes from the profile and steps run directly.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

run_step() {
  local title="$1"
  shift
  echo
  echo "==== $title ===="
  "$@"
}

in_dir() {
  local dir="$1"
  shift
  (cd "$dir" && "$@")
}

run_step "Build backend" in_dir "$ROOT_DIR/src/Ebay" dotnet build
run_step "Install Chromium for behavioral UI tests" node "$ROOT_DIR/src/Ebay/Tests.Frontend/bin/Debug/net10.0/.playwright/package/cli.js" install chromium
run_step "Run backend tests" in_dir "$ROOT_DIR/src/Ebay" dotnet test --no-build
run_step "Run frontend JavaScript tests" node --test "$ROOT_DIR"/src/Ebay/Frontend/Tests/*.test.mjs
run_step "Install Chrome extension dependencies" in_dir "$ROOT_DIR/src/ChromeExtension" npm ci
run_step "Run Chrome extension tests" in_dir "$ROOT_DIR/src/ChromeExtension" npm test
run_step "Build Chrome extension" in_dir "$ROOT_DIR/src/ChromeExtension" npm run build
run_step "Run Chrome extension inputs hash tests" node --test "$ROOT_DIR"/scripts/chrome-extension-inputs-hash/*.test.mjs
run_step "Check OpenSpec CLI and skills versions" bash "$ROOT_DIR/scripts/check-openspec-version/check-openspec-version.sh"
run_step "Validate OpenSpec catalog" in_dir "$ROOT_DIR" openspec validate --all --strict --json
run_step "Validate OpenSpec archive" in_dir "$ROOT_DIR" openspec validate --archived
run_step "Check OpenSpec scenario test coverage" bash "$ROOT_DIR/scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh"

echo

echo "All agent checks passed."
