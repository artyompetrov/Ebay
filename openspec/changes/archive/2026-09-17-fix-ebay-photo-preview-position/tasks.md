## 1. Overlay positioning

- [x] 1.1 In `Server.Adapters.Driving.WebApi/Pages/EbayLotDescriptionPage.cshtml`, change `.photo-hover-full` from `position: fixed; top/left: 50%; transform: translate(-50%, -50%); max-width: 90vw; max-height: 90vh;` to `position: absolute` anchored to `.photo-hover` (horizontally centered over the thumbnail via `left: 50%; transform: translateX(-50%)`, opening below it), with fixed px-based `max-width`/`max-height` per design.md. Verify by rendering `/ebay_description/{productId}` locally for a lot with measurement photos and confirming the CSS rule in the response HTML.
- [x] 1.2 Confirm no ancestor (`table`, `tr`, `td`) clips overflowing absolutely positioned content (no `overflow: hidden`/`clip` introduced), so the overlay can render above neighboring row/cell content as intended.

## 2. Test updates

- [ ] 2.1 Update `Tests.Shared/PhotoPreviewBrowser.cs` to branch its position/size assertions on the existing `deferredFullImage` parameter: keep the current `position: fixed` + viewport-center assertions when `false` (phone-oriented page), assert `position: absolute` anchored relative to the thumbnail when `true` (eBay description page). Verify by running the existing tests that call this helper.
- [ ] 2.2 Run `Tests.Integration/Tests/MeasurementPhotosFlowTests.cs` (covers `PhotoPreviewBrowser.VerifyAsync(html, deferredFullImage: true)` and `SoldPhotoPreviewBrowser.VerifyAsync`) and `Tests.Frontend/MeasurementPhotosTests.cs` and confirm both pass against the updated assertions.

## 3. Spec sync and validation

- [ ] 3.1 Sync the delta in `openspec/changes/fix-ebay-photo-preview-position/specs/measurement-photos/spec.md` into `openspec/specs/measurement-photos/spec.md` (or via archive) so the main spec's "Photos shown on the eBay listing description page" requirement matches the shipped behavior.
- [ ] 3.2 Run `./scripts/agent-check/agent-check.sh` from the repository root and confirm it passes, including `openspec validate --all --strict` and `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh`.
