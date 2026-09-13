# Check OpenSpec test coverage

`check-openspec-test-coverage.sh` verifies that every scenario in the main specs
(`openspec/specs/**/spec.md`) is covered by a test, so a spec-driven story cannot be
considered done while its scenarios are untested and nothing says so. Requirements touched
by started active changes are temporarily deferred, as described below.

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

### Work in progress

An active change is **started** when `openspec list --json` reports `completedTasks > 0`:
at least one tracked task is checked `[x]` (including `[X]`). No tasks, only unchecked tasks,
or only deliberately skipped `[~]` tasks do not activate the exemption. There is no
`implemented` flag, and completing every task does not end the exemption while the change
remains active.

For each started change, the checker defers the exact `(specId, requirement heading)` pairs
in its ADDED, MODIFIED, REMOVED and RENAMED deltas. Both FROM and TO names of a rename are
included. It defers missing coverage and test mapping checks (dangling references and
contradictory exemptions) for these requirements, including new scenarios and new specs.
Other requirements, even in the same spec, remain strict. Structural diagnostics such as
duplicate scenario names and empty exemption reasons remain errors.

The output lists each deferred requirement and the change(s) responsible. Multiple started
changes contribute a union: archiving one does not restore coverage for a requirement still
affected by another started change. Unstarted proposals and archived changes do not grant
exemptions. Resetting all completed tasks to unchecked also removes a change's exemption.

**Finishing a change:** sync its final deltas into `openspec/specs` and archive it, then run
`./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh` (and the usual
`agent-check.sh`) before merging. New scenarios then require tests or justified exemptions;
removed/renamed scenarios must not leave stale test tags. The OpenSpec archive command itself
does not run this project's coverage checker. Merge alone or syncing without archiving does
not remove an active change's exemption. Do not archive with unsynced specs or use
`--skip-specs` for a change that changes requirements.

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

## OpenSpec integration

`openspec show --json` exposes each scenario's WHEN/THEN body but not its
`### Requirement:` / `#### Scenario:` heading text, so there is no CLI output this script
can consume for the mapping key. It reuses the CLI wherever it can - `openspec list --specs
--json` to discover which specs exist and where the openspec root is - and reads only the
heading lines and the `NOT COVERED BY TEST` bullet itself out of spec.md. Everything else
about spec.md's structure and validity is left to `openspec validate --all --strict`, which
already runs as an earlier `agent-check.sh` step.

For active deltas, the script reuses OpenSpec's `parseDeltaSpec` and `discoverSpecFiles`
implementations from the npm-installed CLI on PATH. This handles requirement operations,
nested capability paths, removed requirement lists, renames, and fenced examples without
another handwritten delta parser. These are internal APIs, not a stable public JSON contract:
the loader verifies `.openspec-version`, and import/parse failures fail the check. The
existing Linux/bash workflow requires an npm CLI executable resolvable with `which`;
unsupported wrappers fail with a diagnostic.

Run the integration tests with the pinned CLI on PATH:

```sh
node --test scripts/check-openspec-test-coverage/*.test.mjs
```

The tests use temporary projects and the real CLI, including archive/sync behavior. Run them
when upgrading OpenSpec; update the adapter if its package layout or parser API changes.

Used by:
- `scripts/agent-check/agent-check.sh` (local pre-PR check).
- `.github/workflows/build-and-tests.yaml` (`openspec_validate` job).
