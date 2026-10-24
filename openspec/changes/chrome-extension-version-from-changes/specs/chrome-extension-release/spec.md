## ADDED Requirements

### Requirement: Extension inputs hash
The extension inputs hash SHALL be computed from the paths and contents of the extension inputs: the files tracked by git under `src/ChromeExtension`, except `src/ChromeExtension/tests/` and Markdown files, plus the generated API client `src/ChromeExtension/src/clients/Generated/EbayToolWebApiClient.ts`. The hash SHALL change when an input's content or path changes, when an input is added or removed, and SHALL NOT change for changes to any other file.

#### Scenario: A change outside the inputs keeps the hash
- **WHEN** the hash is computed, then `src/Ebay/Server/Program.cs` is changed and committed, and the hash is computed again
- **THEN** both computations return the same hash

#### Scenario: A change to the extension sources changes the hash
- **WHEN** the hash is computed, then a file under `src/ChromeExtension/src/` is changed and committed, and the hash is computed again
- **THEN** the two hashes differ

#### Scenario: A change to the generated API client changes the hash
- **WHEN** the hash is computed, then the content of the generated API client file is changed, and the hash is computed again
- **THEN** the two hashes differ

#### Scenario: A change to the extension build files changes the hash
- **WHEN** the hash is computed, then `src/ChromeExtension/package.json` is changed and committed, and the hash is computed again
- **THEN** the two hashes differ

#### Scenario: An added input changes the hash
- **WHEN** the hash is computed, then a new file under `src/ChromeExtension/src/` is added and committed, and the hash is computed again
- **THEN** the two hashes differ

#### Scenario: A change to extension tests or docs keeps the hash
- **WHEN** the hash is computed, then files under `src/ChromeExtension/tests/`, `src/ChromeExtension/AGENTS.md` and a Markdown file under `src/ChromeExtension/src/` are changed and committed, and the hash is computed again
- **THEN** both computations return the same hash

#### Scenario: A renamed input changes the hash
- **WHEN** the hash is computed, then a file under `src/ChromeExtension/src/` is renamed without changing its content and committed, and the hash is computed again
- **THEN** the two hashes differ

#### Scenario: An untracked file does not affect the hash
- **WHEN** the hash is computed, then an untracked file is created under `src/ChromeExtension/src/`, and the hash is computed again
- **THEN** both computations return the same hash

### Requirement: Extension inputs hash is reproducible
The hash SHALL depend only on the inputs, not on the location of the repository or the machine computing it, including the line endings (CRLF or LF) the machine writes, and SHALL be printed as lowercase hexadecimal usable as a Docker image tag.

#### Scenario: Two clones give the same hash
- **WHEN** the hash is computed in two clones of the same commit, located in different directories, with identical generated API client files
- **THEN** both computations return the same hash, consisting only of characters `0-9a-f`

#### Scenario: Line endings of the generated client do not affect the hash
- **WHEN** the hash is computed, then the generated API client is rewritten with CRLF line endings and otherwise the same content, and the hash is computed again
- **THEN** both computations return the same hash

### Requirement: Hash cannot be computed without the generated client
Computing the hash SHALL fail with a non-zero exit status and an error message naming the missing file, instead of returning a hash, when the generated API client file does not exist.

#### Scenario: Missing generated client is rejected
- **WHEN** the hash is computed in a repository where the generated API client file does not exist
- **THEN** the computation exits with a non-zero status and its error output names the generated API client file

### Requirement: Extension is rebuilt only when its inputs change
Each image build in CI SHALL compute the extension inputs hash and reuse the extension image tagged with that hash when the registry has it and its version is not older than the `latest` one, without rebuilding the extension. Otherwise it SHALL build the extension, with the existing version scheme: the `yymm.dd.HH.MMSS` timestamp of that build. The backend image SHALL contain the `.crx` from the extension image with the hash of the commit it is built from.

#### Scenario: Deploys without extension changes advertise the same version
- **WHEN** two images are built in CI on `main` from commits that differ only in files outside the extension inputs
- **THEN** the second build does not rebuild the extension, and both backend images serve the same `.crx` with the same version in the update manifest at `/chrome_extensions/{extensionName}.xml`
- **NOT COVERED BY TEST:** CI and Docker wiring (registry lookup, image builds and pushes in the workflow), which the test suites do not run; the hash it relies on is covered by the scenarios above, and the wiring is verified manually on the first deploys after the change

#### Scenario: A deploy with extension changes advertises a newer version
- **WHEN** an image is built in CI on `main` from a commit that changes an extension input
- **THEN** the extension is rebuilt, the extension image is published with the new hash and `latest`, and the backend image serves a `.crx` whose version is greater than the previous one
- **NOT COVERED BY TEST:** CI and Docker wiring, which the test suites do not run; verified manually on the first deploy with an extension change

#### Scenario: A revert of extension inputs advertises a newer version
- **WHEN** an image is built in CI on `main` from a commit that reverts the extension inputs to a state whose hash already has an image in the registry, with a version older than the `latest` image
- **THEN** the extension is rebuilt and the backend image serves a `.crx` whose version is greater than the `latest` one, so installed extensions update to the reverted code
- **NOT COVERED BY TEST:** CI and Docker wiring, which the test suites do not run; the reuse decision was checked against a stubbed `docker` when the workflow step was written

### Requirement: Only main publishes the extension image
Only CI builds on `main` SHALL push the extension image to the registry, tagged with the hash and with `latest`. Builds on other branches SHALL use the extension image they built only for their own backend image.

#### Scenario: A branch build does not publish the extension
- **WHEN** an image is built in CI on a branch other than `main` from a commit that changes an extension input
- **THEN** the extension is built and used for that branch's backend image, and no extension image is pushed to the registry
- **NOT COVERED BY TEST:** CI and Docker wiring, which the test suites do not run; verified manually on the branch of this change
