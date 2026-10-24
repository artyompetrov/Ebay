# Proposal

## Why

Every deploy publishes a new Chrome extension version, even when the extension did not change. `src/Dockerfile` builds the extension and signs the `.crx` with the image's `BUILD_VERSION`, which is the CI build timestamp. So after each backend deploy Chrome auto-updates the extension, and `UpdatesCheckerClient` shows every user an "Ebay Helper extension New version available" alert, although nothing in the extension changed.

## What Changes

- The extension is built in its own Docker image, `ghcr.io/<owner>/ebay-chrome-extension`, which contains only the signed `.crx`. The image is tagged with a hash of the extension's inputs.
- The extension's inputs are the tracked files under `src/ChromeExtension` (without tests and Markdown docs) plus the content of the generated TypeScript API client `EbayToolWebApiClient.ts`. Hashing the generated client itself, not the OpenAPI contract and NSwag setup it comes from, means a backend contract or package change rebuilds the extension only when the client it produces actually changes.
- CI computes the hash on every build. If an extension image with that hash already exists in the registry and its version is not older than the `:latest` one, it is reused and the extension is not rebuilt. Otherwise the image is built: also after a revert, whose hash points to an image with an older version that Chrome would never install over the newer one. Runs without registry credentials (Dependabot) always build. On `main` it is pushed as `:<hash>` and `:latest`; on other branches it is used locally and not pushed.
- The backend image no longer builds the extension. It copies the `.crx` from the extension image passed to it, which in CI is the `:<hash>` image. The default is `:latest`, so local `docker compose build` keeps working once the first `main` build has published it (with `docker login ghcr.io` if the package is private).
- The versioning scheme stays as it is: the extension version is the `yymm.dd.HH.MMSS` timestamp of the build that produced it. Since the extension is rebuilt only when its inputs change (or are reverted), the published version changes only then too. Deploys without extension changes keep the previous version, so Chrome does not update and users see no alert.
- Scripts inside the extension package compute the input hash and decide between reusing and building the image, with tests next to the extension's other tests.

## Capabilities

### New Capabilities
- `chrome-extension-release`: when the Chrome extension published by the backend is rebuilt and gets a new version, and when the previous build and version are kept.

### Modified Capabilities

## Impact

- New `src/ChromeExtension/Dockerfile` (and `.dockerignore`) for the extension image.
- `src/Dockerfile`: the extension build stage is replaced by a copy from the extension image (`EXTENSION_IMAGE` build argument).
- `.github/workflows/build-and-tests.yaml` `build_docker`: generate the API client, compute the hash, reuse or build (and on `main` push) the extension image, pass it to the backend image build. It logs in to the registry on all branches, not only on `main`.
- New `src/ChromeExtension/scripts/inputsHash.mjs` (`npm run --silent inputs-hash`) and `src/ChromeExtension/scripts/extensionImage.mjs` (reuse or build decision) with tests in `src/ChromeExtension/tests`, which the extension's `npm test` already runs in CI and `agent-check`.
- `AGENTS.md` (CI, Dockerfile) and `src/ChromeExtension/AGENTS.md` (how the extension is built and released).
- No change to `ExtensionController`, the update XML, the extension code or the version format.
