## Why

The barcode scanner on `MeasurementPhotos` mirrors every camera preview, including the rear-facing camera selected on a phone. This makes aiming the phone at a measurement barcode counterintuitive, so the page must automatically distinguish mobile clients and show their rear-camera preview in its natural, non-mirrored orientation.

## What Changes

- Automatically determine in the browser whether the current client is a phone/mobile device before presenting the barcode scanner.
- On a detected phone, keep the requested rear-facing (`environment`) camera preview unmirrored.
- On a non-mobile client, preserve the existing mirrored scanner preview.
- Keep barcode recognition, measurement-id extraction, and photo upload behavior unchanged.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `measurement-photos`: The phone-based workflow will automatically adapt the barcode camera preview orientation to the client type, preventing rear-camera mirroring on phones while retaining the current desktop behavior.

## Impact

- Affected UI: `src/Ebay/Frontend/Pages/MeasurementPhotos.razor`.
- Affected browser interop: `src/Ebay/Frontend/wwwroot/js/interop.js` (client classification and scanner-preview presentation).
- No API, database, OpenAPI contract, or server-side changes.
- No new runtime dependency is required; detection uses browser-provided signals with a compatibility fallback.
