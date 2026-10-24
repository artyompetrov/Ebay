# Chrome extension inputs hash

`chrome-extension-inputs-hash.sh` (run with `make -s chrome-extension-inputs-hash`) prints a
sha256 hash of everything the Chrome extension is built from. CI uses it as the tag of the
extension image `ghcr.io/<owner>/ebay-chrome-extension:<hash>` and builds the extension only when
the registry has no image with that tag. So the extension, and with it the version Chrome sees,
changes only when one of its inputs changes (`openspec/specs/chrome-extension-release`).

## Inputs

- Files tracked by git under `src/ChromeExtension`, except `tests/` and Markdown files. This
  includes the extension's `Dockerfile` and `.dockerignore`.
- The generated API client `src/ChromeExtension/src/clients/Generated/EbayToolWebApiClient.ts`.
  It is git-ignored and written by NSwag when `src/Ebay/Server.Client` is built, so build that
  project first; without the file the script fails. Hashing the generated file rather than the
  OpenAPI contract and NSwag setup means a contract or package change counts only when it
  changes the client the extension gets.

Untracked files (`node_modules`, local build output) never count. File contents are read from
the working tree with CRLF normalized to LF: NSwag writes the git-ignored generated client with
the OS line endings, which `.gitattributes` (`eol=lf`) does not cover, so without it the same
commit would hash differently on Windows and Linux.

## Algorithm

For every input, sorted by path (byte order), the line `<path>\0<sha256 of the content>\n`
(content with CRLF replaced by LF) is appended to a buffer. The script prints the sha256 of that buffer in hex.

## Not inputs

The backend domain baked into the manifest (`EBAY_HELPER_BACKEND_DOMAIN`) and the base image of
the extension build are not inputs. To rebuild the extension after changing them, commit a change
to an input, for example a comment in `src/ChromeExtension/Dockerfile`.

## Tests

`node --test scripts/chrome-extension-inputs-hash/*.test.mjs` builds throwaway git repositories and
checks each scenario of `openspec/specs/chrome-extension-release` that the script covers.
