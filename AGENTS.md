# Project AGENTS.md Guide

## About the project
An application for analyzing eBay product prices and subsequent purchasing on external marketplaces.

Project composition:
1. Server side (Docker / docker-compose).
2. Client side (Blazor WebAssembly).
3. Chrome extension for parsing eBay pages and saving data via the API.
4. DB: PostgreSQL.
5. Part of the API code is generated from OpenAPI contracts.

## Base engineering rules
- Follow SOLID, DRY, KISS.
- Avoid copy-pasting; reuse existing solutions.
- Fix the root cause of a problem, not the symptoms.
- Prefer systemic, consistent solutions over local workarounds.

## DI and services
- Default DI registration: `Transient`.
- `Scoped` — only when a shared operation context is genuinely needed (primarily EF `DbContext`).
- `Singleton` — only deliberately and with an explicit justification next to the registration.
- Prefer stateless services (don't store mutable state in fields unless necessary).

## Tests
- For unit tests, use a separate test class per production class where possible.
- Add `[TestOf(typeof(...))]` to the test class.

## Navigation
- `.github/workflows/build-and-tests.yaml` — main CI/CD build and deploy; includes an `openspec_validate` job that installs the OpenSpec CLI version pinned in `.openspec-version`, checks it matches via `scripts/check-openspec-version`, then runs `openspec validate --all --strict` (active changes/specs) and `openspec validate --archived` (archived changes must have every task checked off, `[~]` marks a task deliberately skipped/blocked with an explanation so it isn't counted as incomplete) against `openspec/`.
- `.openspec-version` — single source of truth for the OpenSpec CLI version; used by `scripts/cloud-agent-init/init.sh`, CI, and `scripts/check-openspec-version`. Bump it, reinstall that version, run `openspec update`, and commit the regenerated `.claude/skills/openspec-*` alongside the bump.
- `scripts/check-openspec-version` — verifies the installed `openspec` CLI and the `generatedBy` version in `.claude/skills/openspec-*/SKILL.md` both match `.openspec-version`; run by `scripts/agent-check/agent-check.sh` and CI.
- `.github/workflows/backup-database.yaml` — scheduled job that dumps the production DB over SSH and uploads it to Yandex Disk (`scripts/backup-database/upload_to_yandex_disk.sh`); requires the `SSH_PRIVATE_KEY`/`SSH_HOST`/`SSH_USER` secrets (shared with the deploy job) and a `YANDEX_DISK_TOKEN` secret (OAuth token for the Yandex Disk API).
- `src/Ebay` — backend + Blazor frontend (details: `src/Ebay/AGENTS.md`).
- `src/ChromeExtension` — Chrome extension (details: `src/ChromeExtension/AGENTS.md`).
- `src/Dockerfile` — builds the solution into a container.
- `deploy` — docker-compose for running the app.
- `scripts/cloud-agent-init` — shared cloud sandbox init script (Claude Code, Codex), see its `README.md`.
- `scripts/agent-check` — pre-PR check script (`agent-check.sh`).
- `scripts/deploy-on-server` — script run on the production server to redeploy containers (invoked by the server's own `update.sh`, outside this repo).
- `scripts/backup-database` — Yandex Disk upload helper used by `backup-database.yaml`.

## Pre-PR checks
Run `./scripts/agent-check/agent-check.sh` from the repository root.

## Keeping AGENTS.md up to date
If the task changes rules, structure, build, testing, code generation, or deployment — update the relevant `AGENTS.md` in the same PR.

## Layer-specific rules
Each layer of the project may have its own `AGENTS.md` with detailed constraints.
Find all such files before making changes:

```shell
rg --files --glob "AGENTS.md" "$(git rev-parse --show-toplevel)/src"
```
If the command produces no output, there are no additional layer-specific rules in `src/`.
Read each file found. Layer rules take priority over the global rules within their own layer.

## Fix the cause, not the symptom
Don't patch symptoms (hardcodes, special cases, suppressed errors, copy-paste) — this accumulates entropy in the code.
Find and fix the root cause (an architectural gap, a broken invariant). If that's out of the task's scope —
don't apply a silent workaround; describe the root cause and mark the solution as a TODO.

## Project skills
- Project skills live in [.claude/skills/](.claude/skills/) as Claude Code skills (`SKILL.md` per skill directory).
- Claude Code loads their descriptions automatically and should invoke them when a task matches, without being asked.
- To add, change, or review tests, use the `write-tests` skill.
- For REST API, Swagger/OpenAPI, web DTO, status codes, and error tasks, use the `web-api` skill.
- To add, change, or review logging, use the `logging` skill.
- Before creating, changing, or reviewing any `.cs` file, use the `csharp-style` skill.
