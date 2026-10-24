# Design

## Context

- `build_docker` in `.github/workflows/build-and-tests.yaml` computes `BUILD_VERSION=$(date +'%y%m.%d.%H.%M%S')` and builds `src/Dockerfile` with it. The `build_chrome_extension` stage of that Dockerfile copies `src/ChromeExtension` plus the generated client from the .NET stage, runs `npm run build` (`generateManifest.js` puts `BUILD_VERSION` and `EBAY_HELPER_BACKEND_DOMAIN` into the manifest) and signs `mlebgdemjnpnfgcgbbncllpniiicffbm_<version>.crx` with `key.pem`. The final stage copies it to `/app/wwwroot/chrome_extensions/`.
- `ExtensionController` advertises the highest version among the `.crx` files in that folder, and Chrome updates when it is greater than the installed one. Neither it nor `UpdatesCheckerClient` needs to change.
- The generated client `src/ChromeExtension/src/clients/Generated/EbayToolWebApiClient.ts` is git-ignored. NSwag writes it during the build of `src/Ebay/Server.Client`, a standalone project with no project references.
- `.gitattributes` sets `* text eol=lf`, so tracked files have identical bytes in checkouts on Windows and Linux. It does not cover the git-ignored generated client, which NSwag writes with the OS line endings (CRLF on Windows).
- Images are published to ghcr only on `main`, with `docker login` using the `PAT` secret. `deploy/docker-compose.yaml` builds the backend locally from `../src/` (`build:`) and pulls `ghcr.io/artyompetrov/ebay:latest` on the server.
- Requirements are in `specs/chrome-extension-release/spec.md`.

## Goals / Non-Goals

**Goals:**
- The extension image, and so its version, changes exactly when the extension's own inputs change.
- A backend image always contains the extension built from the same commit's inputs, regardless of what other branches or runs did.

**Non-Goals:**
- Changing the version format or how the version is chosen at build time.
- Cleaning up old extension image tags in ghcr (can be added later with a retention policy).

## Decisions

### Tag by input hash, not by `latest` or a diff with the previous commit
The backend image copies the extension from `ebay-chrome-extension:<hash>`, so its content is determined by the commit. Using `latest` would make it depend on what was pushed last. Deciding "changed or not" from a diff with the previous commit would miss changes whose run was cancelled (`cancel-in-progress: true`). With the hash, a missing image is always built. A revert to earlier inputs reuses the image already in the registry, with the same `.crx` and version. `latest` is still pushed on `main`, and it is the default for local builds.

### Hash the generated client, not its sources
The generated client depends on `WebApi.yaml`, `ClientGeneration.WebApi.json`, the NSwag version in `Directory.Packages.props` and the NSwag templates. Hashing the generated file covers all of these exactly. A package bump or a contract change that does not change the client does not rebuild the extension, and an NSwag upgrade that does change it does rebuild it. The cost is that CI must build `Server.Client` before hashing. That project is small and standalone, and the extension image needs its output anyway.

### Hash algorithm
`scripts/chrome-extension-inputs-hash/chrome-extension-inputs-hash.mjs`:
1. List the inputs with `git ls-files -z -- src/ChromeExtension ':(exclude)src/ChromeExtension/tests' ':(exclude,glob)src/ChromeExtension/**/*.md'`, then add the generated client path. Fail if the generated client file is missing.
2. For each path, sorted by byte order, append `<repo-relative path with />\0<sha256 of the content with CRLF replaced by LF>\n` to a buffer.
3. Print the sha256 of the buffer in hex.

The paths come from git, so untracked files (`node_modules`, local build output) never count. The content is read from the working tree; this equals the commit in CI. Normalizing CRLF makes the generated client, and so the hash, equal across OSes. The script takes an optional repository root argument (default: the git top level of the current directory), which the tests use. The pathspecs and the generated client path are defined only in this script.

It is Node because repository script tests already use `node --test`, and the tests can create throwaway git repositories to cover every hash scenario. Following the `Makefile` rule, it gets a `.sh` entry point and a `chrome-extension-inputs-hash` target. CI calls `make -s chrome-extension-inputs-hash`.

### Extension image
`src/ChromeExtension/Dockerfile`, with `src/ChromeExtension` as context, so the Dockerfile and its `.dockerignore` are themselves inputs:
- a build stage (`node:18-alpine` as today) that runs `npm ci --include=dev`, `npm run build` with `EBAY_HELPER_BACKEND_DOMAIN` and `BUILD_VERSION` build args, and `crx3` with `key.pem`, exactly as the current stage does;
- a final `FROM scratch` stage containing only `/chrome_extensions/mlebgdemjnpnfgcgbbncllpniiicffbm_<version>.crx`.

`.dockerignore` excludes `node_modules`, `tests`, Markdown, `_extension/build` and `_extension/manifest.json`. The final stage carries the version as the `version` label, so CI can log it for a reused image too. The generated client must exist in the context before the build (CI builds `Server.Client` first; locally `dotnet build` does it).

### Backend image
`src/Dockerfile` drops the `build_chrome_extension` stage and the copy of the generated client. It declares `ARG EXTENSION_IMAGE=ghcr.io/artyompetrov/ebay-chrome-extension:latest` before the first `FROM`, adds `FROM ${EXTENSION_IMAGE} AS chrome_extension` and does `COPY --from=chrome_extension /chrome_extensions/ /app/wwwroot/chrome_extensions/`. The final stage no longer needs to know the extension version. The `latest` default keeps `docker compose build` working locally without building the extension, for anyone logged in to ghcr with read access to the private image, once the first `main` build has published it.

### CI `build_docker`
1. Checkout, set up .NET, `dotnet build src/Ebay/Server.Client -c Release` (generates the client).
2. `docker login ghcr.io` with `PAT` on every branch, because pulling and inspecting the private extension image needs it. Pushes stay `main`-only. Runs without the secret (Dependabot runs get only Dependabot secrets) skip the login and build the extension locally.
3. `HASH=$(make -s chrome-extension-inputs-hash)`, `EXT=ghcr.io/${{ github.repository_owner }}/ebay-chrome-extension`. The owner is used rather than `github.actor`, which changes with whoever pushes and would make lookups miss.
4. If `docker manifest inspect "$EXT:$HASH"` succeeds, `docker pull` it. If it fails with `manifest unknown`, or the run is not logged in, build it from `src/ChromeExtension` with `BUILD_VERSION=$(date +'%y%m.%d.%H.%M%S')` and the domain secret, tagged `$EXT:$HASH`. Any other lookup error (network, registry outage, auth) fails the step: treating it as "no image" would republish the extension under a new version on `main`.
5. Build the backend image with `--build-arg EXTENSION_IMAGE="$EXT:$HASH"`. The local tag resolves without pushing, so branch builds work.
6. On `main`: push `$EXT:$HASH` (when built), tag and push `$EXT:latest` every time so it follows `main` after reverts too, then push the backend and nginx images as today.
7. Log the hash, whether the extension was reused or built, and the extension version (from the image label).

### Test discovery
`check-openspec-test-coverage.mjs` gets `scripts/**/*.test.mjs` in `ATTRIBUTE_SOURCE_GLOBS`. `agent-check.sh` and the CI test job run `node --test scripts/chrome-extension-inputs-hash/*.test.mjs`.

## Risks / Trade-offs

- [The `EBAY_HELPER_BACKEND_DOMAIN` secret is baked into the manifest but is not an input, so changing it does not rebuild the extension] → The domain changes very rarely. When it does, commit any change to an input, such as a comment in the extension Dockerfile. This is documented in `src/ChromeExtension/AGENTS.md`.
- [The base image `node:18-alpine` or npm registry content can change without an input change] → The build is pinned by `package-lock.json`, and the image only matters when the extension is rebuilt anyway.
- [A branch with an extension change never publishes, so `main` rebuilds it after merge and the released version is the `main` build's timestamp] → Intended: only `main` builds are released.
- [Branch builds now need registry credentials] → The `PAT` secret is available to push builds on all branches of the repository. Runs without it (Dependabot) build the extension locally instead of failing on the login.
- [Old `:<hash>` tags accumulate in ghcr] → Images are a few hundred KB (`scratch` + `.crx`); a retention policy can be added later.

## Migration Plan

The first `main` build after the change finds no image for the hash, builds one with a new timestamp version and publishes it. Users get one more update, the last spurious one. From then on the version changes only with the inputs. To roll back, revert the change: the backend image builds the extension itself again, with the build timestamp, which is greater than any version published before.
