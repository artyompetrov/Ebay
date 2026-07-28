# Cloud agent init script

`init.sh` provisions a fresh cloud sandbox for working on this repo: PostgreSQL 16,
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
