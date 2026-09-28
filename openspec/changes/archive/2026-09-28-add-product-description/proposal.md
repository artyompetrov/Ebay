## Why

Sellers currently have no way to add free-form, formatted text (e.g. condition notes, backstory, extra selling points) to a product. The eBay listing description page (`EbayLotDescriptionPage`) only renders a fixed, hand-written template built from measurement/photo/passport data - there is no place for a seller-authored description, so anything beyond that template has to be added manually on eBay itself after publishing.

## What Changes

- Add a `Description` field (rich HTML) to the `Product` aggregate, settable/updatable through a domain method.
- Extend the `WebApi.yaml` contract (`ProductWithoutId` schema and related create/update operations) with a `description` property, and regenerate the C#/TS clients.
- Add a WYSIWYG (rich text) editor to the product edit page (`ProductProperties.razor`) using the Quill library wired in via JS interop (following the existing `wwwroot/js/interop.js` pattern), so the seller can author/edit the description as HTML.
- Render the product's description HTML at the top of `EbayLotDescriptionPage`, prepended above the existing auto-generated sections (title/condition, shipping/handling, measurements, photos, passports), which remain unchanged.
- Sanitize the stored/rendered description HTML (allow a safe subset of formatting tags/attributes; strip scripts and event handlers) since it is user-authored HTML rendered on a page served directly to eBay/buyers.

## Capabilities

### New Capabilities
- `product-description`: Storing a rich-text product description on the `Product` aggregate, editing it via a WYSIWYG editor, and surfacing it at the top of the rendered eBay listing description page.

### Modified Capabilities
(none - no existing spec currently covers product fields or the eBay description page's rendered content)

## Impact

- **Domain**: `src/Ebay/Server.Domain/Product/Product.cs` - new `Description` state and an update method.
- **Contracts**: `src/Ebay/Server.Contracts/WebApi/WebApi.yaml` - new `description` property on `ProductWithoutId` (and any dedicated create/update request schemas); regenerates `WebApiController` base, `Server.Client` generated `WebApiClient`, and the Chrome extension's generated TS client.
- **API adapter**: `src/Ebay/Server.Adapters.Driving.WebApi/Controllers/WebApiController.cs` - pass the new field through on create/update.
- **Application layer**: `src/Ebay/Server.Application.New` - use-case(s) for updating a product's description (or extending the existing update use-case).
- **Read model / rendering**: `src/Ebay/Server.Adapters.Driving.WebApi/Pages/EbayLotDescriptionPage.cshtml(.cs)` - reads and renders the description HTML; needs an HTML sanitizer dependency/usage.
- **Frontend**: `src/Ebay/Frontend/Pages/ProductProperties.razor` and a new JS interop module under `src/Ebay/Frontend/wwwroot/js/` for the Quill editor.
- **Dependencies**: adds a client-side rich-text editor (Quill, via CDN or bundled JS) and a server-side HTML sanitizer library.
