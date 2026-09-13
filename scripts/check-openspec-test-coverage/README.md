# Check OpenSpec test coverage

`check-openspec-test-coverage.sh` verifies that every scenario in the main specs
(`openspec/specs/**/spec.md`) is covered by a test, so a spec-driven story cannot be
considered done while its scenarios are untested and nothing says so.

## The mapping

A C# test method is tagged with `[OpenSpecScenario(specId, requirement, scenario)]`
(`Tests.Shared/OpenSpecScenarioAttribute.cs`), naming the spec id and the exact
`### Requirement:` / `#### Scenario:` heading text it verifies. A test can carry more
than one such attribute; each attribute names exactly one scenario.

`Frontend/Tests` uses the Node test runner, which has no real attributes, so JS tests use the
identical `[OpenSpecScenario("specId", "requirement", "scenario")]` text in a `//` comment
directly above the `test(...)` call instead. The script matches the same text either way.

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
- Every `[OpenSpecScenario]` usage (C# attribute or JS comment) resolves to a real,
  currently-covered-required scenario (catches renamed/removed scenarios and typos).
- Scenario names are unique within a requirement (the mapping key must stay unambiguous).

Scenarios that exist only in an active, not-yet-synced `openspec/changes/*/specs/**` delta
are proposed, not shipped, and are intentionally out of scope: run `openspec change sync`
(or archive the change) once the story is implemented and being tested, which moves its
scenarios into `openspec/specs/**` and brings them into this check.

### Known limitation: text matching, not test execution

The script matches `[OpenSpecScenario(...)]` against raw source text under `src/Ebay/Tests.*`
and `src/Ebay/Frontend/Tests`; it does not verify that the usage sits on a test that actually
runs. A commented-out test, the text in a string literal, or an attribute placed on a
non-test/helper method would all still count as "covered" - and for the JS convention, the
usage is *always* a comment, so there is no attribute-vs-runnable-method distinction to check
at all. Deliberately did not build a reflection- or test-runner-based check for the C# side:
coverage also comes from the non-C# suite, so a C#-assembly-specific fix would not be a general
solution, and would add real complexity for partial protection. This is a written rule instead
(see the `write-tests` skill's OpenSpec Scenario Coverage section) enforced by code review, not
by the script.

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
