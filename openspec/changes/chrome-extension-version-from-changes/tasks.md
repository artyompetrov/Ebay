# Tasks

## 1. Input hash script

- [x] 1.1 Add `scripts/chrome-extension-inputs-hash/chrome-extension-inputs-hash.mjs` as described in design.md (input pathspecs and generated client path defined once, `git ls-files` listing, sorted `path\0sha256\n` entries, sha256 hex output, optional repository root argument, non-zero exit with the file name when the generated client is missing). Verify: after `dotnet build src/Ebay/Server.Client`, running it twice prints the same 64-character hex hash, and changing a file under `src/ChromeExtension/src/` changes it.
- [x] 1.2 Add `scripts/chrome-extension-inputs-hash/chrome-extension-inputs-hash.test.mjs` (`node --test`). Each test builds a throwaway git repository in a temp dir with the needed layout and runs the script on it. Cover every scenario of the first three requirements in `specs/chrome-extension-release/spec.md`, one `test(...)` per scenario, tagged with `// [OpenSpecScenario("chrome-extension-release", "<requirement>", "<scenario>")]`. Verify: `node --test scripts/chrome-extension-inputs-hash/*.test.mjs` passes on Windows (Git Bash) and Linux.
- [x] 1.3 Add the `chrome-extension-inputs-hash.sh` entry point and the `chrome-extension-inputs-hash` target to `Makefile` (recipe and `help` line). Verify: `make -s chrome-extension-inputs-hash` prints only the hash.
- [x] 1.4 Add `scripts/**/*.test.mjs` to `ATTRIBUTE_SOURCE_GLOBS` in `scripts/check-openspec-test-coverage/check-openspec-test-coverage.mjs` and update its comment and `README.md`. Verify: `make openspec-coverage-check` reports no missing scenario for `chrome-extension-release` and no unresolved mapping.
- [x] 1.5 Run the new tests in `scripts/agent-check/agent-check.sh` and in the `dotnet_and_extension_build` CI job (after `Setup Node.js`). Verify: `make agent-check` shows and passes the step.

## 2. Extension image and backend image

- [x] 2.1 Add `src/ChromeExtension/Dockerfile` (build stage as the current `build_chrome_extension` stage, final `FROM scratch` stage with only `/chrome_extensions/<id>_<version>.crx`) and `src/ChromeExtension/.dockerignore`. Verify: `docker build --build-arg BUILD_VERSION=2610.24.13.4512 --build-arg EBAY_HELPER_BACKEND_DOMAIN=localhost -t ebay-chrome-extension:local src/ChromeExtension` succeeds and the image contains only `/chrome_extensions/mlebgdemjnpnfgcgbbncllpniiicffbm_2610.24.13.4512.crx`.
- [x] 2.2 `src/Dockerfile`: remove the `build_chrome_extension` stage and the generated client copy, add `ARG EXTENSION_IMAGE=ghcr.io/artyompetrov/ebay-chrome-extension:latest`, `FROM ${EXTENSION_IMAGE} AS chrome_extension` and the copy into `/app/wwwroot/chrome_extensions/`. Verify: `docker build -f src/Dockerfile --build-arg EXTENSION_IMAGE=ebay-chrome-extension:local src/` succeeds, and the container serves `/chrome_extensions/mlebgdemjnpnfgcgbbncllpniiicffbm.xml` with version `2610.24.13.4512`.

## 3. CI

- [ ] 3.1 `.github/workflows/build-and-tests.yaml` `build_docker`: set up .NET and build `Server.Client`; log in to ghcr on all branches; compute the hash with `make -s chrome-extension-inputs-hash`; reuse (`docker manifest inspect` + `docker pull`) or build the extension image `ghcr.io/${{ github.repository_owner }}/ebay-chrome-extension:<hash>` with the timestamp `BUILD_VERSION`; build the backend image with `EXTENSION_IMAGE`; on `main` push `:<hash>` (when built) and `:latest`, then the backend and nginx images; log the hash, reused/built and the version. Verify: the branch run of this change builds the extension (no image for the hash yet) and pushes nothing. A second branch run on a commit that changes only a backend file still builds it (branches do not publish), and its log shows the same hash.

## 4. Documentation

- [x] 4.1 Update root `AGENTS.md` (navigation: `scripts/chrome-extension-inputs-hash`, `Makefile` target, `src/Dockerfile` taking the extension from the extension image, the CI flow) and `src/ChromeExtension/AGENTS.md` (the extension image, what counts as an input, how to build both images locally, and that a domain change needs a commit touching an input to be rebuilt). Verify: the documented local build commands run as written.

## 5. Integration check

- [ ] 5.1 Run `make agent-check`. Verify: it passes.
- [ ] 5.2 After merging, check the first `main` run builds and pushes the extension image, and a later `main` run without extension input changes reuses it. Verify: both runs log the same hash and the second logs "reused"; `https://<domain>/chrome_extensions/mlebgdemjnpnfgcgbbncllpniiicffbm.xml` returns the same `version` after both deploys.

## Workflow follow-up

- Sync the delta spec to `openspec/specs/chrome-extension-release`, archive the change, then run `make openspec-coverage-check`.
