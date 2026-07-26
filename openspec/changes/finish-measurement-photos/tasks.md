## 1. Read-model: batched photo metadata query

- [x] 1.1 Add `MeasurementPhotoMetadata(Guid Id, string MeasurementId, string FileName, int Order)` record (no `Content`) in `Server.Application.Abstractions.Driven/Models`.
- [x] 1.2 Add `Task<IReadOnlyList<MeasurementPhotoMetadata>> GetMetadataByMeasurementIds(IReadOnlyList<string> measurementIds, CancellationToken cancellationToken)` to `IMeasurementPhotoQueries`.
- [x] 1.3 Implement it in `Server.Adapters.Driven.EF.ReadModel/Queries/MeasurementPhotoQueries.cs` as a single projected EF query (`Where(x => ids.Contains(x.MeasurementId)).Select(...)`) that never materializes `Content`.
- [x] 1.4 Covered by `Tests.Integration/Tests/MeasurementPhotosFlowTests.cs` (exercises the query end-to-end through `GetMeasurementPhotoCounts`: multiple ids, an id with no photos, and — since `MeasurementPhotoCountResponse` has no content field — content is structurally excluded). No project precedent exists for testing EF read-model query classes in isolation; all existing read-model coverage goes through the API.

## 2. eBay description page shows photos

- [x] 2.1 In `EbayLotDescriptionPage.cshtml.cs`, inject `IMeasurementPhotoQueries`, call `GetMetadataByMeasurementIds` once with all `Measurements` ids in `OnGet`, and expose the result as a per-measurement-id lookup property (e.g. `PhotosByMeasurementId`).
- [x] 2.2 In `EbayLotDescriptionPage.cshtml`, render each measurement's photos as `<img>` tags pointing at `{baseUrl}/api/webapi/v1/measurements/{measurementId}/photos/{photoId}/content` (the `WebApiController` route is served under the `api/webapi/v1` prefix — an initial version of this omitted the prefix, was reported broken by the user in real usage, and was fixed; the integration test's `Does.Contain` assertion was too loose to catch it since it only checked a path suffix that's a substring of both the correct and the buggy URL — tightened to assert the full prefixed path and to actually fetch the rendered `src` and check for `200 OK`), in the same tube `<tr>`/`<td>` as the existing curves/description images, following the passport `<img>` block already in the file for markup/style conventions.
- [x] 2.3 Verify a measurement with zero photos renders its row unchanged (no broken `<img>`, no empty gallery markup).
- [x] 2.4 Covered by `MeasurementPhotosFlowTests.EbayDescriptionPage_ShowsPhotosForMeasurementsThatHaveThem`, which renders the real page through `WebApplicationFactory`, asserts the photo `<img>` appears for the measurement with a photo and is absent for the one without, and fetches the exact rendered `src` URL to confirm it resolves with `200 OK`.

## 3. WebApi contract: batched photo-count endpoint

- [x] 3.1 Add `GET /measurements/photos/counts` (repeated `measurementIds` query parameter) and a `MeasurementPhotoCountResponse` (`measurementId`, `photoCount`) schema to `Server.Contracts/WebApi/WebApi.yaml`, matching the existing measurement-photos path group's style. Do not touch `Server.Contracts/Legacy/Ebay.yaml`.
- [x] 3.2 Build to regenerate the NSwag client/server code from the updated contract.
- [x] 3.3 Implement the new operation on `WebApiController`, calling `IMeasurementPhotoQueries.GetMetadataByMeasurementIds` once and grouping by measurement id to build the counts.
- [x] 3.4 Covered by `Tests.Integration/Tests/MeasurementPhotosFlowTests.cs`: multiple measurement ids with and without photos, via one batched call. Also uncovered and fixed a pre-existing bug found while writing this test: the `order` field in `MeasurementPhotoUploadRequest` wasn't nullable in the contract, so the generated client always sent `order: 0`, silently defeating the server's auto-increment for every existing upload caller (including the phone page). Fixed by making `order` nullable in `WebApi.yaml`.

## 4. Phone page: support direct measurement id entry

- [x] 4.1 Update `MeasurementPhotos.razor`'s routing/parameters so it can accept a measurement id directly (`/measurement-photos/{MeasurementId}`), setting `_measurementId` and calling `LoadPhotosAsync` immediately when present, skipping the barcode-scan requirement.
- [x] 4.2 Keep the existing barcode-scan flow working unchanged when no id is supplied.
- [ ] 4.3 Not performed interactively: the page requires login and I can't enter credentials (even user-supplied ones) per hard safety rules. Verified instead by build success and code review of the `[Parameter]`/`OnInitializedAsync` logic; recommend the user click through once logged in.

## 5. Office measurements page: photo indicator and delete entry point

- [x] 5.1 In `Measurements.razor`, after `_allMeasurements` loads, call the new `WebApiClient` counts endpoint once with all their ids and store the result as a `Dictionary<string, int>` keyed by measurement id.
- [x] 5.2 Add a photo-count badge/link per measurement row (near the existing curves `NavLink`) reading from that dictionary (default 0), styled consistently with the other row action links, navigating (new tab) to the direct-id URL from task 4.1 for that row's `measurement.MeasurementId`.
- [ ] 5.3 Not performed interactively for the same reason as 4.3 (login-gated page). The underlying counts endpoint and its response shape are covered by `MeasurementPhotosFlowTests`; the Razor binding was verified by build success and code review.

## 6. Regression check

- [x] 6.1 Ran `./agent-check.sh`: build succeeded, 25 unit tests + 10 integration tests passed, Chrome extension built cleanly.
