# Check OpenSpec test coverage

`check-openspec-test-coverage.sh` verifies that every scenario in the main specs
(`openspec/specs/**/spec.md`) is covered by a test, so a spec-driven story cannot be
considered done while its scenarios are untested and nothing says so.

## The mapping

A test method is tagged with `[OpenSpecScenario(specId, requirement, scenario)]`
(`Tests.Shared/OpenSpecScenarioAttribute.cs`), naming the spec id and the exact
`### Requirement:` / `#### Scenario:` heading text it verifies. A test can carry more
than one such attribute; each attribute names exactly one scenario.

A scenario that is deliberately not covered by a test gets a bullet inside its
`#### Scenario:` block instead:

```
#### Scenario: Something rare
- **WHEN** ...
- **THEN** ...
- **NOT COVERED BY TEST:** <why this isn't tested>
```

The justification is required - an empty flag is a reported issue, not a valid exemption.

## What the script checks

- Every scenario in `openspec/specs/**` is either matched by at least one
  `[OpenSpecScenario]` attribute, or flagged `NOT COVERED BY TEST` with a reason - not both.
- Every `[OpenSpecScenario]` attribute in the test projects resolves to a real,
  currently-covered-required scenario (catches renamed/removed scenarios and typos).
- Scenario names are unique within a requirement (the mapping key must stay unambiguous).

Scenarios that exist only in an active, not-yet-synced `openspec/changes/*/specs/**` delta
are proposed, not shipped, and are intentionally out of scope: run `openspec change sync`
(or archive the change) once the story is implemented and being tested, which moves its
scenarios into `openspec/specs/**` and brings them into this check.

## Why it reads spec.md directly

`openspec show --json` exposes each scenario's WHEN/THEN body but not its
`### Requirement:` / `#### Scenario:` heading text, so there is no CLI output this script
can consume for the mapping key. It reuses the CLI wherever it can - `openspec list --specs
--json` to discover which specs exist and where the openspec root is - and reads only the
heading lines and the `NOT COVERED BY TEST` bullet itself out of spec.md. Everything else
about spec.md's structure and validity is left to `openspec validate --all --strict`, which
already runs as an earlier `agent-check.sh` step.

Used by:
- `scripts/agent-check/agent-check.sh` (local pre-PR check).
