## Why

When a radio tube is sold, its measurement's price/curve charts on the eBay listing already stop showing real data and switch to a "Sold" placeholder. Its photos do not: the thumbnail and full-size photo endpoints keep serving the real photo forever, with no awareness of the sale. A buyer (or anyone) browsing an already-sold tube's listing still sees the exact photo of the unit that was already shipped to someone else, which is inconsistent with how the rest of the listing behaves and misleading about what is actually available.

## What Changes

- Once a measurement's tube is sold, requests for that measurement's photo content and thumbnail no longer return the real photo. They return a placeholder image instead, so the photo appears to have disappeared from the listing rather than showing broken-image icons or the real (already-sold) unit.
- This applies to both the thumbnail image and the full-size image reachable via the existing hover/tap preview, so a viewer cannot recover the real photo by any path once the tube is sold.
- Behavior for non-sold measurements (Created, Selling) is unchanged: the real photo and thumbnail are returned exactly as today, 404 when the photo does not exist.
- The eBay listing description page's photo thumbnail sizing becomes driven by the returned image itself rather than a fixed box, so a hidden photo collapses away visually instead of leaving a blank box the same size as a real thumbnail. This affects listing pages generated after this change ships; already-published eBay listings keep their existing frozen HTML.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `measurement-photos`: the "Photo binary retrieval" and "Photo thumbnail retrieval" requirements currently promise the real photo/thumbnail whenever the row exists, with no regard for whether the tube has been sold. These requirements are amended so that a sold measurement's photo/thumbnail requests return a placeholder image instead of the real content, while non-sold behavior is unchanged.

## Impact

- Public, anonymous photo/thumbnail endpoints used as `<img>` sources on the live eBay listing description page.
- The eBay listing description page's photo thumbnail styling.
- No database schema change; no change to upload, deletion, or the internal office/phone photo management pages.
