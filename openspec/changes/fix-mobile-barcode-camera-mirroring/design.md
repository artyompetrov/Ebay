## Context

`MeasurementPhotos.razor` currently applies `transform: scaleX(-1)` to every `<video>` created inside `#reader`. The scanner always requests `facingMode: "environment"`, so a phone normally opens its rear camera but the page then mirrors that preview unconditionally. Barcode decoding still receives frames, but the visual feedback moves opposite to the operator's hand and makes lining up a barcode unnecessarily difficult.

The decision must be made entirely in the Blazor WebAssembly client: the server has no reliable device information, and the CSS is applied to a video element that `html5-qrcode` creates dynamically. Browser support also differs: Chromium exposes `navigator.userAgentData.mobile`, while Safari and older browsers do not.

## Goals / Non-Goals

**Goals:**
- Classify the current browser as mobile/phone or non-mobile without user input.
- Present the rear-camera scanner preview without horizontal mirroring on a detected phone.
- Preserve the current mirrored presentation for non-mobile clients.
- Keep the classification and presentation logic testable as small JavaScript functions rather than embedding an opaque expression in Blazor markup.
- Preserve scanner startup, decoding, shutdown, and error behavior.

**Non-Goals:**
- Do not change which camera `html5-qrcode` requests; it continues to request the environment-facing camera.
- Do not change barcode parsing, measurement lookup, photo capture/upload, APIs, or persistence.
- Do not add a manual preview-orientation switch.
- Do not attempt exhaustive device-model identification or fingerprinting.

## Decisions

### 1. Detect mobile status in browser interop, not on the server

The interop module will expose a focused mobile-client classifier. It will prefer the boolean `navigator.userAgentData.mobile` signal when available and fall back to a conservative phone-oriented user-agent check for browsers such as iOS Safari. The fallback will recognize common phone/mobile tokens and will not classify a desktop merely because it has a touch screen.

This classification is evaluated when the scanner starts, so client-side navigation and direct navigation use the same behavior and no server-rendered hint can become stale.

**Alternative considered:** Infer mobile from viewport width or coarse pointer media queries. Rejected because narrow desktop windows and touch-enabled laptops would be misclassified; these signals describe the current input/layout, not the client device category requested by the scenario.

**Alternative considered:** Inspect the HTTP `User-Agent` on the server. Rejected because this page is a WebAssembly client and the decision only affects browser-created scanner markup; routing the decision through the server adds coupling without improving reliability.

### 2. Apply an explicit state class to the scanner host

Before calling `html5QrCode.start`, interop will set one of two mutually exclusive state classes on `#reader` based on the classifier. CSS will scope horizontal mirroring to the non-mobile state; the mobile state will explicitly use the natural orientation. Applying state to the stable host works even though `html5-qrcode` creates and removes its `<video>` asynchronously.

Explicit mobile and non-mobile states make the default visible in markup and prevent old state from surviving a subsequent scanner start. The CSS remains responsible for presentation, while JavaScript is responsible only for classification and assigning state.

**Alternative considered:** Set `video.style.transform` after scanner startup. Rejected because it couples interop to library timing and dynamically generated child details, and it could flash the wrong orientation before the promise resolves.

**Alternative considered:** Remove mirroring globally. Rejected because the requested behavior requires automatic client differentiation and preserving the existing non-mobile experience.

### 3. Verify classification separately from scanner integration

Unit-level JavaScript checks will cover the modern browser signal, the compatibility fallback, and representative desktop/mobile inputs. A component/markup check will verify that mirroring is conditional rather than unconditional. Manual responsive/device verification remains useful for confirming the actual camera preview because automated test environments generally lack a physical rear camera.

## Risks / Trade-offs

- [Risk] User-agent compatibility fallbacks are heuristic and can be spoofed or changed by browsers. → Prefer the structured `userAgentData.mobile` signal whenever present, keep the fallback narrow, and treat orientation as a UX enhancement rather than a security decision.
- [Risk] Some tablets identify as mobile even though the request specifically mentions phones. → Accept the browser's explicit mobile classification; an environment-camera preview on such a device benefits from the same natural orientation, and no functional behavior depends on the classification.
- [Risk] `html5-qrcode` may apply its own transform in a future version. → Scope the application's explicit transform to the reader video and manually verify after library upgrades; this change introduces no dependency upgrade.
- [Trade-off] Non-mobile clients retain mirroring even if they use an external rear-facing camera. → This follows the requested phone/non-phone distinction; camera-facing-mode detection can be proposed separately if actual device testing shows it is a better product rule.

## Migration Plan

1. Add the mobile classifier and reader-state assignment in the existing interop module.
2. Replace unconditional reader-video mirroring with state-scoped rules on `MeasurementPhotos.razor`.
3. Run automated checks and manually verify phone and desktop classifications with representative browser environments.

There is no data or contract migration. Rollback is a plain revert of the interop and page-style changes.

## Open Questions

None.
