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

## Build and release
- The extension is built by `Dockerfile` here into an image that contains only the signed `.crx`; the backend image (`src/Dockerfile`) copies it from there. The version is the build timestamp (`yymm.dd.HH.MMSS`) of that image.
- CI tags the image with the hash of the extension inputs and rebuilds it only when no image with that hash exists. So a new version, the Chrome auto-update and the in-extension update alert happen only when the extension itself or the generated client changes (`openspec/specs/chrome-extension-release`).
- The hash is printed by `npm run --silent inputs-hash` (`scripts/inputsHash.mjs`, tests in `tests/InputsHash.test.ts`). Inputs are the files tracked by git here except `tests/` and Markdown (so the `Dockerfile`, `.dockerignore` and the hash script itself count), plus the git-ignored generated `src/clients/Generated/EbayToolWebApiClient.ts`, which NSwag writes when `src/Ebay/Server.Client` is built; without it the script fails. Hashing the generated client rather than the OpenAPI contract and NSwag setup means a contract or package change counts only when it changes the client the extension gets. Contents are hashed with CRLF normalized to LF, because NSwag writes the client with the OS line endings.
- The backend domain and the base image are not inputs: after changing them, commit a change to an input (e.g. a comment in `Dockerfile`) to rebuild the extension.
- Local images: `dotnet build src/Ebay/Server.Client` (generates the client), then `docker build -t ebay-chrome-extension:local src/ChromeExtension` and `docker build -f src/Dockerfile --build-arg EXTENSION_IMAGE=ebay-chrome-extension:local src/`. Without `EXTENSION_IMAGE` the backend image takes the extension last published from `main` (`ghcr.io/artyompetrov/ebay-chrome-extension:latest`); the image is private, so this needs `docker login ghcr.io` with read access to it.

## Build before PR
- `cd /workspace/Ebay/src/ChromeExtension && npm test && npm run build`
