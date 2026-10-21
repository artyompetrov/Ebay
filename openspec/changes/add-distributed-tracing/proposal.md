# Proposal

## Why

The backend already creates tracing spans (chipfind and qrz adapters, sale-advertisement monitoring), but no tracer provider subscribes to them and the observability stack only stores logs, so every span is dropped. Without traces neither people nor the coding agent can see where a slow or failing request spent its time; the agent can already read prod logs through the Grafana MCP server, and traces are the missing half.

## What Changes

- The backend records server-side traces for incoming HTTP requests, outgoing HTTP calls, database commands and the existing application span sources, and exports them over OTLP using the same `OTEL_*` settings as logs.
- Every request is kept (no sampling); health checks, static frontend files and `/.well-known/*` requests are not traced.
- Traces never contain SQL parameter values, HTTP headers or URL query strings.
- The OpenTelemetry collector gets a traces pipeline that forwards spans to a new Grafana Tempo service with 7-day retention.
- Grafana gets a provisioned Tempo datasource with a fixed UID, plus links between logs and traces in both directions (log `trace_id` to trace, trace to its logs).
- The agent queries traces through the existing `grafana` MCP server (Tempo tools) with the existing read-only `mcp` Viewer user; no new MCP server or secret.
- `AGENTS.md` documents how to reach traces from an agent session.
- Out of scope: client-side tracing (Blazor WebAssembly frontend, Chrome extension) and trace context propagation from them.

## Capabilities

### New Capabilities
- `observability-tracing`: which backend activity is recorded as traces, what is excluded from tracing, which data a trace must never contain, and how long traces are kept and queryable.

### Modified Capabilities
<!-- None: the "Monitoring is traced" requirement of sale-advertisement-monitoring keeps its wording; this change only makes its spans reach storage. -->

## Impact

- Code: `src/Ebay/Server.Platform` (tracing setup next to the existing OTLP logging), new OpenTelemetry instrumentation package references in `Directory.Packages.props`, integration tests in `src/Ebay/Tests.Integration`.
- Deploy: `deploy/docker-compose.yaml` (new `ebay_tempo` service and volume, memory limit), `deploy/config/otelcollector/config.yaml` (traces pipeline), new `deploy/config/tempo/`, Grafana provisioning under `deploy/config/grafana/provisioning/datasources/`.
- Server resources: one more container (Tempo, capped at about 512 MB RAM) and up to 7 days of trace data on disk under `deploy/mount/tempo`.
- Docs: root `AGENTS.md` (Navigation, Grafana/MCP paragraph).
- No API, contract or database schema changes.
