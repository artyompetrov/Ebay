## 1. Mobile client classification

- [x] 1.1 Add a focused browser-side mobile classifier in `Frontend/wwwroot/js/interop.js` that prefers `navigator.userAgentData.mobile` and uses a conservative phone/mobile user-agent fallback when the structured signal is unavailable.
- [x] 1.2 Update `StartQrScanner` to classify the client at scanner startup and replace any previous reader state with the appropriate mobile or non-mobile CSS class before `html5-qrcode` creates its video.

## 2. Conditional scanner presentation

- [x] 2.1 Replace the unconditional `#reader video` horizontal transform in `MeasurementPhotos.razor` with state-scoped styles that explicitly leave detected mobile previews unmirrored and retain mirroring for detected non-mobile previews.
- [x] 2.2 Confirm scanner startup still requests `facingMode: "environment"` and successful scans still stop and clear the scanner before returning the decoded value.

## 3. Verification

- [x] 3.1 Add automated coverage for structured mobile true/false values and fallback classification of representative phone and desktop browser identifiers, using the project's available JavaScript test approach or a dependency-free test harness if no runner exists.
- [x] 3.2 Verify the scanner host receives exactly one orientation state on repeated starts and that the stylesheet contains no unconditional reader-video mirroring rule.
- [x] 3.3 Manually verify a phone/rear-camera preview moves naturally (not mirrored) and a desktop scanner preview retains its current mirrored behavior; confirm neither flow asks the operator to select a client type.
- [x] 3.4 Run `./agent-check.sh` from the repository root.
