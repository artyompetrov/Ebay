---
# Do not edit manually - this file is mirrored.
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

## Parallel Execution

Write tests assuming parallel execution.

Avoid global shared state. Keep AwesomeAssertions equivalency configuration local to the assertion instead of using `AssertionOptions` or similar global mechanisms.

Use `NonParallelizable` only when the architecture makes parallel execution impossible, not as a workaround for mutable shared state.
