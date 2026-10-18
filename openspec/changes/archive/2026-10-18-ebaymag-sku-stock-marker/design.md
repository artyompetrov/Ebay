# Design

## Context

See proposal.md - Why. The stock highlighting lives in the DOM-only module `src/siteProcessors/ebayMag/StockQuantityHighlighter.ts`. `EbayMagSiteProcessor` calls it every second, and it is tested with `node:test` + `jsdom` on a snapshot of the ebaymag stock table. In a data row the SKU cell holds a `div[role="button"]` with the SKU text. The quantity cell is editable and is replaced by an edit control on hover.

## Goals / Non-Goals

**Goals:**
- Show the stock mismatch where hovering does not destroy it: next to the SKU, not in the quantity cell.
- One-click navigation from a listing to the product in our app.

**Non-Goals:**
- No backend change; no periodic refresh (unchanged).
- No editing of ebaymag quantities.

## Decisions

1. **Badges element next to the SKU.** For a known lot the module keeps one extension-owned `<span data-ebay-tool-sku-badges>` inserted right after the SKU element (`skuElement.after(...)`). It holds the stock marker (if any) and the product link. The span is rebuilt only when its content (marker kind, tooltip, URL) changes, so hover state is not reset every second, and it is removed when the row's SKU is not one of our lots. Alternative considered: inserting the badges inside the SKU element. Rejected because ebaymag renders the SKU text there and the element is clickable (it opens the edit form).
2. **Emoji markers with `title` tooltips.** ❗ for over-stock (`Listed 4, only 2 in stock: reduce the quantity`), ⚠️ for under-stock (`Listed 1, 3 in stock: the quantity can be increased`). A native `title` keeps it simple and works on a non-editable element.
3. **Clicks do not reach ebaymag.** The badges span stops the propagation of `click`, `auxclick`, `mousedown`, `mouseup`, `pointerdown` and `pointerup` in the bubble phase. This covers React's root listeners, so pressing the link or the marker does not open ebaymag's row editor. Capture-phase handlers on ebaymag's side would still see the events; this has to be confirmed on the live page. The link uses `target="_blank" rel="noopener noreferrer"`.
4. **Lot data passed in, URL built by the caller.** `highlightStockRows(root, lotsById)` takes a `ReadonlyMap<string, { availableQuantity, productUrl }>`. The processor builds `productUrl` from the backend base URL (the same domain serves the Blazor app). This keeps the module free of build-time constants and testable.
5. **Unreadable quantity keeps the badges.** The listed quantity is read from the quantity cell's `<button>`. When the button is missing or its text is not an integer (the cell is in edit mode), existing badges are left as they are, so the marker does not vanish while the operator edits the quantity. This applies only when the badges were built for the same SKU: a row reused for another of our lots during editing gets that lot's link and no marker. A row without badges yet gets only the product link.
6. **Quantity cell untouched.** The previous quantity colouring and its restore logic are removed. Only the green SKU colour keeps the save/restore of the original inline colour.

## Risks / Trade-offs

- [React re-render drops our span] → It is re-created on the next 1-second pass.
- [Emoji rendering differs between OS fonts] → Acceptable; the tooltip text carries the meaning.
- [The SKU column is a fixed 90px flex cell] → The 7-character SKU plus two emoji may overflow or be clipped; to be checked on the live page.
