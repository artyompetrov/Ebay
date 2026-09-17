## Why

The eBay listing description page's photo preview is specified to show the full-size photo "centered in the viewport" on hover/tap. In production, eBay renders this seller-authored HTML inside its own `<iframe id="desc_ifr">`, which it auto-stretches (via the `height` attribute) to exactly match the rendered content height instead of scrolling internally. `position: fixed` and `vh` inside that iframe resolve against the iframe's own inflated initial containing block, not the real browser viewport, so on any lot with a sizeable measurement table the preview renders at one fixed vertical offset into the whole table instead of near the thumbnail the viewer is actually looking at. "Centered in the viewport" is not an achievable behavior in this hosting environment, so the spec itself needs correcting alongside the fix.

## What Changes

- Replace the eBay description page's full-size photo overlay positioning (`position: fixed` + `top/left: 50%` + `vh`-based sizing) with an overlay anchored to the specific thumbnail the viewer hovered/tapped, so it reliably appears near what they interacted with regardless of the description iframe's height.
- Update the "Photos shown on the eBay listing description page" requirement and its hover/tap scenarios to describe the preview as anchored to its thumbnail instead of centered in the viewport.
- No change to the equivalent preview on the phone-oriented `MeasurementPhotos.razor` management page — that page is not embedded in an iframe, viewport-centering already works correctly there, and its requirement is untouched.

## Capabilities

### Modified Capabilities
- `measurement-photos`: the "Photos shown on the eBay listing description page" requirement's full-size preview positioning changes from viewport-centered to thumbnail-anchored.

## Impact

- `Server.Adapters.Driving.WebApi/Pages/EbayLotDescriptionPage.cshtml` (`.photo-hover-full` rule)
- `Tests.Shared/PhotoPreviewBrowser.cs` (shared Playwright verifier's position/size assertions, used by both the affected eBay-description-page test and the unaffected phone-page test)
- `openspec/specs/measurement-photos/spec.md` (requirement wording, via sync at archive)
