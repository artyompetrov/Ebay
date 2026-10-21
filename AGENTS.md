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
- Default and only DI registration in our code: `Singleton`. `Scoped`/`Transient` are banned at compile time (RS0030); exceptions are listed with reasons in `src/Ebay/BannedSymbols.txt`.
- Per-operation state (EF contexts, units of work) is created per call or passed as a method argument, never stored in a service field.
- Services are stateless (don't store mutable state in fields unless it is deliberately process-wide and thread-safe).

## Tests
- For unit tests, use a separate test class per production class where possible.
- Add `[TestOf(typeof(...))]` to the test class.
- Every scenario in `openspec/specs/**` must be covered by a test tagged `[OpenSpecScenario(specId, requirement, scenario)]`, or flagged `NOT COVERED BY TEST` with a justification in the spec itself. Requirements touched by an active change with at least one completed task are temporarily deferred (including their test mappings); see the `write-tests` skill and `scripts/check-openspec-test-coverage`.

## Navigation
- `.mcp.json` — project-scoped MCP servers available to every Claude Code session. Includes `deepwiki` (`https://mcp.deepwiki.com/mcp`), which indexes this public repo (`artyompetrov/Ebay`) and exposes `ask_question`/`read_wiki_*` tools for quick architecture/cross-file questions. Its answers are a generated summary that can lag behind the latest commits — treat it as a starting point, not a source of truth; verify anything load-bearing against the actual source or these `AGENTS.md` files.
  Also includes `grafana` (`mcp-grafana`, run via `uvx`) for querying prod Loki logs and Tempo traces through Grafana (`https://${EBAY_HELPER_BACKEND_DOMAIN}/grafana/`). The prod domain is not hardcoded anywhere in the repo: set the `EBAY_HELPER_BACKEND_DOMAIN` env var (the same one the Chrome extension build and CI use) locally and in the cloud agent environment, otherwise Claude Code cannot expand `.mcp.json`. Grafana is proxied by nginx on port 443 because cloud agent sandboxes can only reach ports 80/443. It logs in as the read-only Viewer user `mcp`, whose password comes from the `GRAFANA_MCP_PASSWORD` env var (set it locally and in the server's `.env`). The user is created idempotently by the one-shot `ebay_grafana_init` service in `deploy/docker-compose.yaml` (`deploy/config/grafana/init-mcp-user.sh`); if the variable is empty, creation is skipped.
  Traces (`openspec/specs/observability-tracing`) go from the backend over OTLP to `ebay_otelcollector`, then to `ebay_tempo` (Grafana Tempo, config `deploy/config/tempo/tempo.yaml`, data in `deploy/mount/tempo`, 7-day retention, `mem_limit` 512 MB). Query them with the MCP Tempo tools (`search_tempo_traces` with TraceQL such as `{resource.service.name="ebay_helper" && status=error}`, `get_tempo_trace`, `list_tempo_attribute_names`) against the datasource uid `tempo`; the Loki datasource uid is `P8E80F9AEF21F6940`. Logs and traces are linked: Loki records written inside a span carry `trace_id` (query `{service_name="ebay_helper"} | trace_id="<id>"`), and Grafana links a log's `trace_id` to its trace and a span to its logs.
- `.github/workflows/build-and-tests.yaml` — main CI/CD build and deploy; includes an `openspec_validate` job that installs the OpenSpec CLI version pinned in `.openspec-version`, checks it matches via `scripts/check-openspec-version`, runs `openspec validate --all --strict` (active changes/specs) and `openspec validate --archived` (archived changes must have every task checked off with `[x]`; any other checkbox, including `[~]`, counts as incomplete, so a task deliberately skipped/blocked becomes a plain bullet without a checkbox, `- Skipped X.Y: <task> (<explanation>)`) against `openspec/`, then `scripts/check-openspec-test-coverage`.
- `.openspec-version` — single source of truth for the OpenSpec CLI version; used by `scripts/cloud-agent-init/init.sh`, CI, and `scripts/check-openspec-version`. Bump it, reinstall that version, run `openspec update`, and commit the regenerated `.claude/skills/openspec-*` alongside the bump.
- `scripts/check-openspec-version` — verifies the installed `openspec` CLI and the `generatedBy` version in `.claude/skills/openspec-*/SKILL.md` both match `.openspec-version`; run by `scripts/agent-check/agent-check.sh` and CI.
- `scripts/check-openspec-test-coverage` — verifies every scenario in `openspec/specs/**` is mapped to a test via `[OpenSpecScenario]` (`src/Ebay/Tests.Shared`) or flagged `NOT COVERED BY TEST` with a reason; temporarily defers requirements touched by active changes with `completedTasks > 0`; its shell entry point runs the real-CLI integration tests first, then repository coverage; `scripts/agent-check/agent-check.sh` and CI call that single entry point. See the `write-tests` skill for the mapping rules.
- `.github/workflows/backup-database.yaml` — scheduled job that dumps the production DB over SSH and uploads it to Yandex Disk (`scripts/backup-database/upload_to_yandex_disk.sh`); requires the `SSH_PRIVATE_KEY`/`SSH_HOST`/`SSH_USER` secrets (shared with the deploy job), a `YANDEX_DISK_TOKEN` secret (OAuth token for the Yandex Disk API), and a `YANDEX_OAUTH_CLIENT_ID` secret (client_id of the Yandex OAuth app that issued the token, used to build the re-authorization link when the token expires).
- `src/Ebay` — backend + Blazor frontend (details: `src/Ebay/AGENTS.md`).
- `src/ChromeExtension` — Chrome extension (details: `src/ChromeExtension/AGENTS.md`).
- `src/Dockerfile` — builds the solution into a container. The final stage is the chiseled (distroless) `aspnet:*-noble-chiseled-extra` image: no shell or package manager, runs as the non-root `app` user (uid 1654). In `deploy/docker-compose.yaml` `ebay_helper` runs with a read-only root filesystem (only `/tmp` tmpfs and mounted volumes are writable); the one-shot `ebay_helper_init` service chowns the DataProtection keys volume to uid 1654. Don't add shell-based `entrypoint`/`command` overrides for it.
- `deploy` — docker-compose for running the app. Observability configs live in `deploy/config/` (`otelcollector` - logs to Loki and traces to Tempo, `loki`, `tempo`, `grafana` provisioning). Portainer (`ebay_portainer`) mounts the Docker socket, so it serves plain HTTP published only on the server's `127.0.0.1:9000` and is not proxied by nginx; open it through an SSH tunnel: `ssh -L 9000:127.0.0.1:9000 <user>@<server>`, then `http://localhost:9000`.
- `scripts/cloud-agent-init` — shared cloud sandbox init script (Claude Code, Codex), see its `README.md`.
- `scripts/agent-check` — pre-PR check script (`agent-check.sh`).
- `scripts/deploy-on-server` — `deploy-on-server.sh` updates the production server's checkout to `origin/main` and redeploys the containers (`set -euo pipefail`, so any failed step fails the deploy). The CI deploy job pipes it over SSH from its own checkout into `${WORK_DIR}/Ebay` on the server, so the server keeps no deploy script outside the repo; to redeploy by hand, run it from inside that checkout.
- `scripts/backup-database` — Yandex Disk upload helper used by `backup-database.yaml`.

## Pre-PR checks
When finishing an OpenSpec change, sync its final specs and archive it before the final
coverage check. Run `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh`
after archiving and fix missing tests or stale mappings before merging. Archiving itself
does not run this checker; merge alone does not remove active-change exemptions. Another
started change touching the same requirement continues to defer that requirement.

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

## TODO comments
`// TODO: ...` (or the language's equivalent) is the project's main way of recording deferred work — it lives
in the code, so it's trivially greppable/indexable later, unlike a reply left only in a review thread or chat.
When a code review (human or automated, e.g. a bot like `chatgpt-codex-connector`) raises something that should
genuinely be done later rather than in the current change, leave a TODO comment at the exact place in the code
it applies to, in addition to any reply on the review thread. Don't reference a task/ticket/issue number in it —
just describe the work and, if useful, why it's deferred.

## Project skills
- Project skills live in [.claude/skills/](.claude/skills/) as Claude Code skills (`SKILL.md` per skill directory).
- Claude Code loads their descriptions automatically and should invoke them when a task matches, without being asked.
- To add, change, or review tests, use the `write-tests` skill.
- For REST API, Swagger/OpenAPI, web DTO, status codes, and error tasks, use the `web-api` skill.
- To add, change, or review logging, use the `logging` skill.
- Before creating, changing, or reviewing any `.cs` file, use the `csharp-style` skill.
