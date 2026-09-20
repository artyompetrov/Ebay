## Why

Staff scanning a measurement's barcode with a phone camera must hold the phone very close to the label to make the code large enough for `html5-qrcode` to decode. At that distance the phone's camera (outside a dedicated macro lens) cannot autofocus, so the preview is blurry and scanning repeatedly fails. Adding a manual zoom control lets staff scan from a distance where autofocus works and zoom in instead of physically moving closer.

## What Changes

- Add a zoom slider to the barcode scanner UI, shown only when the active camera track reports a `zoom` capability (`MediaStreamTrack.getCapabilities()`); hidden/absent entirely on devices or browsers that don't expose it (most desktops, iOS Safari), leaving today's scanning behavior unchanged there.
- Drive the slider directly from JavaScript against the running video track (`Html5Qrcode.applyVideoConstraints({ advanced: [{ zoom }] })`), without a Blazor JS-interop round trip per drag event, so the control stays responsive.
- Implement this once in the shared `StartQrScanner()` function in `interop.js`, since both existing call sites (`MeasurementPhotos.razor`'s barcode-to-photos flow and `Measurements.razor`'s barcode-to-upload flow) use it - fixing it there benefits both without duplicating logic.
- No change to decoding behavior, supported barcode formats, or the existing mobile/non-mobile mirrored-orientation handling.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `measurement-photos`: the "Phone-based photo upload" requirement gains a scenario describing the zoom control's appearance (when the camera supports it) and absence (when it doesn't).

## Impact

- `src/Ebay/Frontend/wwwroot/js/interop.js`: `StartQrScanner()` gains zoom-capability detection and slider wiring against the running camera track.
- `src/Ebay/Frontend/Tests/measurement-photos-interop.test.mjs`: the `Html5Qrcode` test mock gains `getRunningTrackCapabilities`/`applyVideoConstraints`; new assertions cover slider shown/hidden per capability and that dragging it applies the zoom constraint.
- `src/Ebay/Frontend/Pages/MeasurementPhotos.razor` and `Measurements.razor`: no C# code changes expected (the control is injected into the DOM by `interop.js` next to `#reader`); minor CSS may be added for slider placement/styling.
- `Measurements.razor`'s own barcode-to-upload scan flow gets the same fix as a side effect of the shared function, even though it isn't covered by any existing `openspec/specs/**` capability - no spec changes are needed there since none exist today.
- `openspec/specs/measurement-photos/spec.md`: new scenario under "Phone-based photo upload".
