# Cloud agent init script

`init.sh` provisions a fresh cloud sandbox for working on this repo: `make` (the entry point for repository
scripts, see the root `Makefile`), PostgreSQL 16,
the Docker daemon (the sandbox ships Docker but doesn't start it; needed by the Testcontainers-based integration tests),
the .NET SDK, `dotnet-ef`, `dotnet restore`, `npm install` for the Chrome extension,
and the OpenSpec CLI. It's idempotent, so re-running it on an already-provisioned
sandbox is safe and fast.

The script is agent-agnostic — it only assumes it lives at `scripts/cloud-agent-init/`
inside the repo and derives `REPO_DIR` from its own location (override by exporting
`REPO_DIR` before calling it). Any cloud coding agent's setup step can invoke it:

- **Claude Code**: `.claude/hooks/session-start.sh` sources it on `SessionStart`,
  gated behind `CLAUDE_CODE_REMOTE=true`, and afterwards persists the .NET `PATH`
  additions into `CLAUDE_ENV_FILE`.
- **Codex**: point the cloud environment's setup script at
  `scripts/cloud-agent-init/init.sh` (or `source` it from a thin wrapper, the same
  way the Claude hook does, if Codex needs its own gating/env-persistence logic).

## Testcontainers in the sandbox

Integration tests start PostgreSQL through Testcontainers. Anonymous pulls from Docker Hub
share the sandbox's egress IP and get HTTP 429, so export
`TESTCONTAINERS_HUB_IMAGE_NAME_PREFIX=mirror.gcr.io` (the Claude hook does this through
`CLAUDE_ENV_FILE`; do the same in any other agent's setup). If Docker is unusable, set
`EBAY_TESTS_POSTGRES_CONNECTION_STRING` to the local PostgreSQL on port 15432 instead.
