---
name: write-tests
description: Project testing rules. Use when adding, changing, or reviewing tests; choosing assertion style; deciding whether generated OpenAPI/swagger/schema artifacts need tests; testing manual logic around generated contracts; or checking whether tests are safe for parallel execution.
---

# Write Tests

## Core Rules

Use AwesomeAssertions with `Should()` syntax in new tests. Do not add FluentAssertions: this solution uses the AwesomeAssertions fork.

Prefer testing through the narrowest useful public or internal behavior. Use `[InternalsVisibleTo]` for test access instead of widening production types or members to `public`.

Keep tests compatible with nullable reference types and `TreatWarningsAsErrors=true`.

## Generated Contract Artifacts

If an OpenAPI/swagger/schema contract and the corresponding code are generated automatically by the standard build path, trust the generator. Do not write tests that only repeat generator guarantees, such as:

- a schema field appears in generated code;
- a spec references a schema file;
- a generated schema matches the source contract.

These tests do not catch meaningful regressions; they duplicate the generator.

## What To Test

Test manual logic written on top of generated code:

- mapping generated DTOs into application or domain models;
- default values and fallback semantics;
- runtime validation that is not covered by generated attributes;
- business interpretation of contract fields;
- error handling and translation.

Use this criterion: a test should verify system behavior when working with a contract, not the fact that generation happened.

## OpenSpec Scenario Coverage

Every scenario under `openspec/specs/**` (a main/archived spec - shipped behavior) must be
covered by a test, and the mapping must be explicit and checkable, not implied.

Tag the test method with `[OpenSpecScenario(specId, requirement, scenario)]`
(`Tests.Shared/OpenSpecScenarioAttribute.cs`), where `requirement`/`scenario` are the exact
`### Requirement:` / `#### Scenario:` heading text from the spec. A test may carry more than
one `[OpenSpecScenario]` attribute if it genuinely verifies more than one scenario; each
attribute still names exactly one scenario, so the test-to-scenario mapping stays unambiguous.

```csharp
[Test]
[OpenSpecScenario("measurement-photos", "Photo binary retrieval", "Fetch missing photo content")]
public async Task GetContent_UnknownPhoto_ReturnsNotFound()
{
    ...
}
```

The Node test runner used by `Frontend/Tests` has no real attributes, so JS tests use the exact
same `[OpenSpecScenario(...)]` text in a `//` comment directly above the `test(...)` call instead:

```js
// [OpenSpecScenario("measurement-photos", "Phone-based photo upload", "Mobile detection compatibility fallback")]
test("IsMobileClient falls back to mobile user-agent identifiers", () => {
    ...
});
```

If a scenario is deliberately not covered by a test, do not skip it silently: add a
justification bullet inside that scenario in the spec.md itself, e.g.:

```
#### Scenario: Something rare
- **WHEN** ...
- **THEN** ...
- **NOT COVERED BY TEST:** manual QA only, camera hardware not available in CI
```

A scenario is either covered by at least one `[OpenSpecScenario]` attribute or flagged
`NOT COVERED BY TEST` with a real reason - never both, never neither.

Requirements touched by an active change with at least one completed task are temporarily
excluded from coverage and mapping checks. The checker uses `completedTasks > 0` from
`openspec list --json`; unchecked or skipped `[~]` tasks alone do not qualify. ADDED,
MODIFIED, REMOVED, and both RENAMED names are deferred at requirement scope. Unrelated
requirements remain strict. New-only scenarios are not required until synced, and new test
tags are accepted early only for requirements deferred by a started change.

When finishing a change, sync the final specs, archive the change, and run
`scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh` before merging.
Archiving removes that change's exemption: final scenarios need tests or justified
exemptions, and old mappings for removed/renamed scenarios must be fixed. The OpenSpec
archive command itself does not run the coverage checker. Merge alone, syncing alone, or
completing every task does not end an active change's exemption. If another started change
still touches the same requirement, that requirement remains deferred.

The checker and its integration tests run in `agent-check.sh` and CI. Structural errors
remain strict even for deferred requirements. See `scripts/check-openspec-test-coverage/README.md`
for the exact scope and OpenSpec integration constraints.

The checker matches `[OpenSpecScenario(...)]` against raw source text; it does not verify that
the attribute sits on a test that actually runs. Do not game this: don't leave the attribute on
a commented-out test, on a non-test/helper method, or anywhere else it wouldn't correspond to a
real, executing test (in any test suite - C# or JS). A mapping that isn't backed by a running
test is worse than an honest `NOT COVERED BY TEST` flag, because it hides the gap instead of
naming it.

## Parallel Execution

Write tests assuming parallel execution.

Avoid global shared state. Keep AwesomeAssertions equivalency configuration local to the assertion instead of using `AssertionOptions` or similar global mechanisms.

Use `NonParallelizable` only when the architecture makes parallel execution impossible, not as a workaround for mutable shared state.
