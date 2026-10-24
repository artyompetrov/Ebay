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
The backend image copies the extension from `ebay-chrome-extension:<hash>`, so its content is determined by the commit. Using `latest` would make it depend on what was pushed last. Deciding "changed or not" from a diff with the previous commit would miss changes whose run was cancelled (`cancel-in-progress: true`). With the hash, a missing image is always built. `latest` is still pushed on `main`, and it is the default for local builds.

### A reverted extension is rebuilt, not reused
After inputs A (version V1) and then B (V2) were released, reverting B brings back hash(A), whose image in the registry still has V1. Reusing it would advertise V1 < V2: Chrome never downgrades and `UpdatesCheckerClient` alerts only about newer versions, so users would silently stay on B. So the image for the hash is reused only when its `version` label is not older than the label of `latest` (the version installed after the last `main` deploy). Otherwise the extension is rebuilt with a new timestamp, and on `main` the `:<hash>` tag is overwritten. Versions are compared part by part as numbers. A hash image whose label is not a valid version is rebuilt; an invalid label on `latest` fails the build, because then nothing guards against a downgrade. The decision lives in `src/ChromeExtension/scripts/extensionImage.mjs`, which takes the docker CLI as a function, so `tests/ExtensionImage.test.ts` covers every branch with a stubbed registry; the workflow step only calls it and acts on `reuse`/`build`. "Not found" is recognized as `manifest unknown` (ghcr) or `no such manifest` (how the docker CLI reports some registries); anything else is an error. Alternatives: a monotonic part in the tag (for example the build timestamp) would lose the reuse that is the point of the tag; comparing against the version in the production update XML would need the production domain and network access in CI.

### Hash the generated client, not its sources
The generated client depends on `WebApi.yaml`, `ClientGeneration.WebApi.json`, the NSwag version in `Directory.Packages.props` and the NSwag templates. Hashing the generated file covers all of these exactly. A package bump or a contract change that does not change the client does not rebuild the extension, and an NSwag upgrade that does change it does rebuild it. The cost is that CI must build `Server.Client` before hashing. That project is small and standalone, and the extension image needs its output anyway.

### Hash algorithm
`src/ChromeExtension/scripts/inputsHash.mjs`, run as `npm run --silent inputs-hash` in `src/ChromeExtension`:
1. List the inputs with `git ls-files -z -- src/ChromeExtension ':(exclude)src/ChromeExtension/tests' ':(exclude,glob)src/ChromeExtension/**/*.md'`, then add the generated client path. Fail if the generated client file is missing.
2. For each path, sorted by byte order, append `<repo-relative path with />\0<sha256 of the content with CRLF replaced by LF>\n` to a buffer.
3. Print the sha256 of the buffer in hex.

The paths come from git, so untracked files (`node_modules`, local build output) never count. The content is read from the working tree; this equals the commit in CI. Normalizing CRLF makes the generated client, and so the hash, equal across OSes. The script takes an optional repository root argument (default: the git top level of the current directory), which the tests use. The pathspecs and the generated client path are defined only in this script.

It lives in the extension, not in the repository `scripts/`, because it belongs to how the extension is built and released. Its tests, `src/ChromeExtension/tests/InputsHash.test.ts`, run with the extension's `npm test`, which CI and `agent-check` already run and whose folder the coverage checker already scans. The script is plain ESM JavaScript (`.mjs`), not TypeScript, so it runs on the CI runner's default Node without type stripping. The tests create throwaway git repositories to cover every hash scenario. Since the script sits under `src/ChromeExtension`, it is itself an input: changing the hash logic rebuilds the extension once, like a change to the extension `Dockerfile`.

### Extension image
`src/ChromeExtension/Dockerfile`, with `src/ChromeExtension` as context, so the Dockerfile and its `.dockerignore` are themselves inputs:
- a build stage (`node:18-alpine` as today) that runs `npm ci --include=dev`, `npm run build` with `EBAY_HELPER_BACKEND_DOMAIN` and `BUILD_VERSION` build args, and `crx3` with `key.pem`, exactly as the current stage does;
- a final `FROM scratch` stage containing only `/chrome_extensions/mlebgdemjnpnfgcgbbncllpniiicffbm_<version>.crx`.

`.dockerignore` excludes `node_modules`, `tests`, Markdown, `_extension/build` and `_extension/manifest.json`. The final stage carries the version as the `version` label, so CI can log it for a reused image too. The generated client must exist in the context before the build (CI builds `Server.Client` first; locally `dotnet build` does it).

### Backend image
`src/Dockerfile` drops the `build_chrome_extension` stage and the copy of the generated client. It declares `ARG EXTENSION_IMAGE=ghcr.io/artyompetrov/ebay-chrome-extension:latest` before the first `FROM`, adds `FROM ${EXTENSION_IMAGE} AS chrome_extension` and does `COPY --from=chrome_extension /chrome_extensions/ /app/wwwroot/chrome_extensions/`. The final stage no longer needs to know the extension version. The `latest` default keeps `docker compose build` working locally without building the extension, once the first `main` build has published it (with `docker login ghcr.io` if the package is private).

### CI `build_docker`
1. Checkout, set up .NET, `dotnet build src/Ebay/Server.Client -c Release` (generates the client).
2. `docker login ghcr.io` with `PAT` on every branch, because inspecting and pulling the extension image may need it (packages can be private) and the rebuild decision needs a reliable lookup. Pushes stay `main`-only. Runs without the secret (Dependabot runs get only Dependabot secrets) skip the login and build the extension locally.
3. `INPUTS_HASH=$(cd src/ChromeExtension && npm run --silent inputs-hash)`, `EXTENSION_IMAGE=ghcr.io/${{ github.repository_owner }}/ebay-chrome-extension:$INPUTS_HASH`. The owner is used rather than `github.actor`, which changes with whoever pushes and would make lookups miss.
4. When logged in, `node src/ChromeExtension/scripts/extensionImage.mjs "$EXTENSION_IMAGE" <image>:latest` looks both images up, pulls them and prints `reuse` or `build` (see the revert decision above), logging the versions and the reason. Any lookup error other than "not found" (network, registry outage, auth) fails the step: treating it as "no image" would republish the extension under a new version on `main`. On `build`, or when not logged in, build it from `src/ChromeExtension` with `BUILD_VERSION=$(date +'%y%m.%d.%H.%M%S')` and the domain secret, tagged `$EXTENSION_IMAGE`, and log the version.
5. Build the backend image with `--build-arg EXTENSION_IMAGE="$EXTENSION_IMAGE"`. The local tag resolves without pushing, so branch builds work. A branch behind `main` gets a hash image older than `latest` and so rebuilds locally; nothing is published, so this only costs build time.
6. On `main`: push `$EXTENSION_IMAGE` (when built, overwriting it after a revert), tag and push `:latest` every time so it always matches the deployed extension, then push the backend and nginx images as today.

## Risks / Trade-offs

- [The `EBAY_HELPER_BACKEND_DOMAIN` secret is baked into the manifest but is not an input, so changing it does not rebuild the extension] → The domain changes very rarely. When it does, commit any change to an input, such as a comment in the extension Dockerfile. This is documented in `src/ChromeExtension/AGENTS.md`.
- [The base image `node:18-alpine` or npm registry content can change without an input change] → The build is pinned by `package-lock.json`, and the image only matters when the extension is rebuilt anyway.
- [A branch with an extension change never publishes, so `main` rebuilds it after merge and the released version is the `main` build's timestamp] → Intended: only `main` builds are released.
- [Branch builds now need registry credentials] → The `PAT` secret is available to push builds on all branches of the repository. Runs without it (Dependabot) build the extension locally instead of failing on the login.
- [Old `:<hash>` tags accumulate in ghcr] → Images are a few hundred KB (`scratch` + `.crx`); a retention policy can be added later.

## Migration Plan

The first `main` build after the change finds no image for the hash, builds one with a new timestamp version and publishes it. Users get one more update, the last spurious one. From then on the version changes only with the inputs. To roll back, revert the change: the backend image builds the extension itself again, with the build timestamp, which is greater than any version published before.
