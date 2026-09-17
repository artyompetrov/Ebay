## Context

See proposal.md for motivation. Key constraint confirmed against a real exported eBay listing: eBay renders the seller description inside `<iframe id="desc_ifr" height="<content-height>px" width="100%">`, auto-stretched to the full rendered content height so the iframe never scrolls internally (the outer page scrolls it as one tall block instead). `position: fixed` and `vh` inside that iframe's document resolve against its own initial containing block — i.e. against that inflated height — not the real device viewport. The iframe's *width* is `100%` and tracks the real column width without inflation, so horizontal viewport units/percentages are not affected the same way; only the vertical axis is unreliable. `position: fixed` can't be split per axis, so any use of it inside this iframe inherits the broken vertical containing block regardless of what the horizontal value is.

## Goals / Non-Goals

**Goals:**
- Make the full-size photo overlay on the eBay description page appear predictably next to the thumbnail a viewer actually hovered/tapped, on any table length.
- Stop depending on `vh` for the overlay's size cap, since it's subject to the same broken containing block.

**Non-Goals:**
- Changing `.photo-hover-backdrop` (`position: fixed; inset: 0`). It isn't part of the reported bug: since the iframe's own box already spans the full rendered description, an inset-0 fixed backdrop still visually dims that whole block. Only the *overlay's* `top/left: 50%` centering is actually broken.
- Changing the phone-oriented `MeasurementPhotos.razor` management page. It's a normal Blazor page, not iframe-embedded, so its identical-looking `position: fixed; top/left: 50%` overlay already centers correctly in the real viewport today.

## Decisions

**Anchor the overlay to the thumbnail's own `.photo-hover` span using `position: absolute`, instead of `position: fixed` centered on the viewport.**
`.photo-hover` is already `position: relative`, so its child `.photo-hover-full` can be repositioned to open near that specific thumbnail (e.g. below it, horizontally centered over it via `left: 50%; transform: translateX(-50%)`) using ordinary document-flow positioning that isn't affected by the iframe's height inflation.

Alternatives considered:
- *Keep `position: fixed`, only "fix" the vertical value.* Rejected — `position: fixed` as a whole establishes its containing block from the (broken) iframe viewport; there's no way to keep the horizontal behavior while discarding just the vertical one.
- *Anchor to the enclosing `<td>`/row instead of the individual thumbnail.* Rejected as unnecessary — the existing markup already gives each photo its own positioned `.photo-hover` span (`#photo-hover-{id}`), so anchoring per-thumbnail requires no markup restructuring and matches the requirement's "preview ... in place" wording more directly.

**Cap the overlay's size with fixed pixel values instead of `vh`/`vw`.**
Use a moderate constant (e.g. `max-width: min(90vw, 420px); max-height: 420px;`) — `vw` is left as an extra safety net since it isn't inflated the way `vh` is, but the primary cap is a fixed px value so sizing is predictable on both phone and desktop regardless of table length.

**Branch the shared Playwright verifier's position assertions on the existing `deferredFullImage` flag.**
`Tests.Shared/PhotoPreviewBrowser.cs` is used by both the affected eBay-description-page test (`deferredFullImage: true`) and the unaffected phone-page test (`deferredFullImage: false`). That flag already tracks exactly which page is under test, so it's the natural switch: keep asserting `position: fixed` + viewport-center coordinates when `false`, assert the new `position: absolute`-relative-to-thumbnail behavior when `true`.

## Risks / Trade-offs

- Nothing currently sets `overflow: hidden` on the table or its cells, so the absolutely positioned overlay is free to render over neighboring row/cell content as intended → no mitigation needed, but worth a visual check after implementation since a table's default box behavior could change if other CSS is added later.
- An overlay opened right at the bottom of the visible table could render close to the page edge on a very short viewport → acceptable: it will still appear at a fixed, predictable offset from the thumbnail (unlike today, where it could be strictly invisible), and the requirement only calls for an overlay "anchored to that thumbnail," not one guaranteed to stay fully on-screen in every case.
