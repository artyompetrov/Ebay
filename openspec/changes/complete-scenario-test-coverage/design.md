## Context
Coverage tags must represent executing behavior tests. The baseline has no browser/component harness.

## Decisions
Use bUnit for actual Blazor components, Playwright Chromium for CSS and network behavior on rendered HTML, and existing NUnit integration tests for HTTP and SQL. Inject the barcode hardware boundary without changing its browser implementation. Keep the strict coverage checker unchanged. Isolate NUnit results per retry attempt; timeout still fails the parent test.

## Risks
Browser binaries must be installed in CI. Photo size and MIME regressions require explicit API tests. Cache migration is blocked until independent review accepts coverage and fixes.
