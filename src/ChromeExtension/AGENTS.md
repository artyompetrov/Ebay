# AGENTS.md for src/ChromeExtension

Rules for the Chrome extension in `src/ChromeExtension`.

## Code style
- Use TypeScript static typing.
- Don't use `any` if a correct type can be described.
- Specify input and output types for functions.
- Move reusable utilities into `src/infrastructure`.
- All HTTP goes through `fetchResource` (`src/infrastructure/Utils.ts`, executed by the background service worker). It adds a W3C `traceparent` to backend calls only (one trace id per loaded page, `src/infrastructure/TraceContext.ts`, `openspec/specs/observability-tracing`) and logs that trace id with the request, so the backend trace can be found in Grafana; don't send it to other hosts.

## Tests
- Tests live in `tests/**/*.test.ts` and run with `npm test`: Node's built-in test runner executes TypeScript directly (type stripping, Node 22.18+), DOM is provided by `jsdom`. Tests are not type-checked, so keep them to erasable TypeScript syntax and import sources with an explicit `.ts` extension.
- Keep page logic that needs tests in modules that depend only on the DOM (no `chrome.*`, no backend clients), e.g. `src/siteProcessors/ebayMag/StockQuantityHighlighter.ts`; site processors call them.
- Third-party page markup used by tests is a trimmed snapshot in `tests/fixtures/`; refresh it when the site changes.
- Map OpenSpec scenarios with a `// [OpenSpecScenario("spec", "requirement", "scenario")]` comment directly above the `test(...)` call (see the `write-tests` skill).

## Build before PR
- `cd /workspace/Ebay/src/ChromeExtension && npm test && npm run build`
