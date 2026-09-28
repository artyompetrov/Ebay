## Context

See `proposal.md` - Why. Relevant current state:

- `Product` (`Server.Domain/Product/Product.cs`) is a private-constructor aggregate with `Create`/`Update` factory/mutator methods and no public setters (`Weight`, `Name`, etc. are `private set`, changed only through those methods).
- The eBay listing description page is `EbayLotDescriptionPage.cshtml`/`.cshtml.cs`, a Razor Page reached via `GET /webapi/v1/lot-for-sales/{lotId}/description` → `WebApiController.GetLotForSaleDescription` → `LocalRedirect`. It renders a fixed HTML template built from `Product`, `Measurement`, and `Passport` query data; there is no existing free-text section.
- `WebApi.yaml` is the single OpenAPI contract; NSwag generates the `WebApiController` base, the `Server.Client` C# client, and the Chrome extension's TS client from it.
- The frontend has no component library (no MudBlazor) and no existing rich-text editor. `ProductProperties.razor` uses plain Bootstrap `EditForm`/`InputText`. JS interop already follows an ES-module pattern in `wwwroot/js/interop.js`.
- This page is served directly to eBay and, transitively, to buyers, so any user-authored HTML rendered on it is an XSS/injection surface.

## Goals / Non-Goals

**Goals:**
- Let a seller author a rich-text description per product and have it appear on the rendered eBay description page.
- Keep the existing auto-generated template output byte-for-byte unchanged when no description is set.
- Close the XSS surface introduced by rendering user-authored HTML on an externally-served page.

**Non-Goals:**
- No push/API integration with eBay's own Sell/Inventory API - the description continues to reach eBay only via the page the seller points their listing description to.
- No rich-text editing for other entities (lots, measurements, etc.) - this covers the `Product` aggregate only.
- No WYSIWYG feature parity with eBay's own listing editor (tables, embedded video, etc.) - a standard formatting subset (bold/italic, headings, lists, links, images) is sufficient.

## Decisions

### Store description as HTML on the `Product` aggregate
Add a `Description` (nullable/optional `string`, HTML) property to `Product`, set via a new domain method (e.g. `Product.UpdateDescription(string? description)`) or as an added parameter on the existing `Update(...)` method, consistent with the project's no-public-setters rule. Sanitize before storing (see below), so `Description` on the aggregate is always already-safe HTML - callers (including the Razor page) never need to re-sanitize.

**Alternative considered**: store raw editor output and sanitize only at render time. Rejected - sanitizing once at write time means every reader (now just the description page, potentially others later) gets a value that's already safe, and avoids re-running sanitization on every page render.

### Sanitize with a dedicated HTML sanitizer library, applied in the application layer
Use an allow-list HTML sanitizer (e.g. `HtmlSanitizer` (Ganss.XSS) or equivalent) invoked in the `Server.Application.New` use-case that handles product creation/update, before the sanitized value is passed into the domain method. This keeps the domain model dependency-free (per the project's hexagonal rules - domain holds business rules, not I/O/library concerns) while guaranteeing nothing reaches the aggregate un-sanitized.

**Alternative considered**: sanitize in the WebApi adapter (controller) instead of the application layer. Rejected - the application layer is where use-case-level invariants belong per `AGENTS.md`, and keeping it there means any other driving adapter that creates/updates a product in the future gets the same guarantee for free.

### Contract change: add `description` to `ProductWithoutId` (and related schemas)
Add an optional `description: string` (nullable) property to the `ProductWithoutId` schema in `WebApi.yaml`, regenerate the C#/TS clients. The Chrome extension does not need to read/write this field; the generated TS client simply carries an extra optional property it can ignore.

### Frontend editor: Quill via JS interop
Add a small JS interop module (e.g. `wwwroot/js/productDescriptionEditor.js`) following the existing `interop.js` ES-module pattern, loading Quill (via CDN `<script>`/`<link>` in `index.html`, no npm/build pipeline exists in `Frontend`) and exposing `init(elementId, initialHtmlContent)` / `getHtml(elementId)` functions. `ProductProperties.razor` calls `init` on render and reads the HTML back via `getHtml` before submitting the update, matching how other JS interop is used in this component tree.

**Alternative considered**: TinyMCE. Rejected - heavier, and several of its richer features are cloud/paid-gated, which is unnecessary for the formatting subset needed here.

### Description placement on the listing page: prepended, existing sections untouched
Render `@Html.Raw(Model.Product.Description)` (guarded by a null/empty check) at the very top of `EbayLotDescriptionPage.cshtml`, before the existing title/condition heading. Because the value is sanitized before it ever reaches storage, rendering it via `Html.Raw` at this point is safe. No existing markup in the page moves or changes.

## Risks / Trade-offs

- **[Risk] Sanitizer allow-list too strict or too permissive** → Start with a conservative, explicitly-defined allow-list (text formatting, headings, lists, links with `href` only, images with `src`/`alt` only); revisit if sellers report needed formatting is being stripped. Cover the allow-list boundary with tests per the spec's sanitization requirement.
- **[Risk] Regenerating `WebApi.yaml` clients touches a shared generated surface (Server.Client + Chrome extension TS client)** → The new property is additive and optional, so existing consumers that don't reference it are unaffected; regenerate and rebuild all consumers as part of this change to confirm no breakage.
- **[Trade-off] Sanitizing at write time (not render time)** → If the sanitizer's allow-list needs to tighten later, previously-stored descriptions won't automatically be re-sanitized against the new rules. Acceptable given the app's scale; a one-off backfill/migration can be written later if ever needed.
