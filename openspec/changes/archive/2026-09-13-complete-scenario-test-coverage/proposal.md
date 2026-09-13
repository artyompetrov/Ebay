## Why
The new coverage gate exposes 45 unmapped shipped scenarios. Some lack behavioral tests, and caught NUnit assertions poison otherwise successful eventual-consistency checks.

## What Changes
- Map existing tests and add missing component, browser, API and database coverage.
- Repair discovered implementation mismatches with the existing photo requirements.
- Isolate retry assertions, await asynchronous assertions, and run all suites in CI.
- Complete independent reviewer/fix iterations before any HybridCache migration.

## Capabilities
### New Capabilities
None.
### Modified Capabilities
None. This restores and verifies existing requirements; `skip_specs: true`.

## Impact
Test projects, frontend test seams, photo processing, CI and agent-check. No API shape changes. HybridCache is a subsequent change.
