# Proposal

## Why

The red/yellow colouring of the quantity on the ebaymag stock page is hard to use. The quantity cell is editable: hovering it replaces the number with an edit control and ebaymag's own tooltip, so the highlight and our tooltip disappear exactly when the operator looks at them. The operator also has no quick way to jump from a listing to the product in our app.

## What Changes

- The extension no longer touches the quantity cell. Instead, it shows an emoji marker next to the (green) SKU of our lot when the listed quantity differs from the lot's available quantity: ❗ when more is listed than is in stock, ⚠️ when less is listed. Hovering the marker shows a tooltip saying the quantity has to be changed and how many units are in stock.
- Next to the SKU of every one of our lots the extension shows a 🔗 link to the product's measurements page in our app (`/Product/{productId}/Measurements`), opened in a new tab.
- Markers and links follow the current row content (reused rows, corrected quantities), as the highlight did.
- **BREAKING** (operator-visible): the red/yellow quantity colouring and its tooltip are removed.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `ebaymag-stock-quantity-check`: a quantity mismatch is shown as an emoji marker with a tooltip next to the SKU instead of colouring the quantity; a product page link is added next to the SKU.

## Impact

- Extension: `src/ChromeExtension/src/siteProcessors/ebayMag/StockQuantityHighlighter.ts`, `EbayMagSiteProcessor.ts`, `src/ChromeExtension/src/constants.ts` (frontend product URL), tests in `src/ChromeExtension/tests`.
- No backend or contract change: `LotForSaleResponse` already carries `productId` and `availableQuantity`.
