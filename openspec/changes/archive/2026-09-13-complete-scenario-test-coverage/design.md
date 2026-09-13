## Context
Coverage tags must represent executing behavior tests. The baseline has no browser/component harness.

## Decisions
Use bUnit for actual Blazor components, Playwright Chromium for CSS and network behavior on rendered HTML, and existing NUnit integration tests for HTTP and SQL. Inject the barcode hardware boundary without changing its browser implementation. Keep the strict coverage checker unchanged. Isolate NUnit results per retry attempt; timeout still fails the parent test.

## Risks
Browser binaries must be installed in CI. Photo size and MIME regressions require explicit API tests. Cache migration is blocked until independent review accepts coverage and fixes.

## Defects discovered by the tests
- NUnit stores failed assertions in the active result even when caught. Each polling attempt uses an isolated result; both single and grouped assertion exceptions are retried. Unexpected exceptions propagate and permanent failures time out.
- TestServer defaults to dropping ExecutionContext. Preserve it in the integration fixture so AsyncLocal SQL scopes observe HTTP requests. Cold-count assertions prevent a disconnected interceptor from masquerading as cache coverage.
- Invalid Skia input can produce a null codec and ArgumentNullException. Check codec creation explicitly to preserve the intended invalid-image contract.
- Original photos now enforce a 2 MiB encoded-byte cap as well as the existing 2000-pixel edge cap. Re-encoding produces JPEG and updates stored MIME consistently, including backfill.
- Missing photo IDs return 404 even for sold measurements. Sold lookups check metadata without loading photo bytes, and warm results stay cached.
- Photo management opens in the current tab so returning recreates the office table and reloads counts. Hover previews only apply to hover-capable devices; touch uses the checkbox and backdrop.

- Integration fixtures share an atomic seed sequence for unique measurement IDs and archive contents in each freshly created test database, eliminating random collisions.

## Review evidence
Independent review required two-photo layout checks, fresh touch-first contexts, exact selected-image network assertions, and touch-only backdrop closure. These are implemented in shared browser checks with page JavaScript disabled. All 45 scenarios remain strict, with zero exemptions or deferred requirements.

## Validation
CI run [34779597129](https://github.com/artyompetrov/Ebay/actions/runs/34779597129) passed all 104 .NET tests (68 unit, 28 integration, 8 frontend), five JavaScript tests, OpenSpec validation, and Docker builds. The strict coverage entrypoint also passed after archiving: ten checker integration tests and 45/45 mapped scenarios, with zero exemptions or deferrals. Full local agent-check was attempted but this container cannot run the WebAssembly MSBuild task host; the complete build and browser/database suite were verified in GitHub Actions.

Independent reviewer final verdict: Approved, no remaining findings. Coverage/review phase complete before evaluating HybridCache.
