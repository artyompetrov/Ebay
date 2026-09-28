## 1. Domain

- [ ] 1.1 Add an optional `Description` (HTML string) property to `Product` (`Server.Domain/Product/Product.cs`), set only through `Create`/`Update` (or a new `UpdateDescription` method) - no public setter - and verify with a unit test that a product created/updated with a description exposes it, and one without a description exposes `null`/empty.
- [ ] 1.2 Verify clearing an existing description (update with empty/null) results in no stored description, covered by a unit test.

## 2. Contract

- [ ] 2.1 Add an optional, nullable `description` string property to the `ProductWithoutId` schema (and any other request/response schema that needs it) in `Server.Contracts/WebApi/WebApi.yaml`.
- [ ] 2.2 Regenerate the generated clients (`WebApiController` base, `Server.Client` C# client, Chrome extension TS client) and verify the solution and the Chrome extension both build with no changes needed beyond the regenerated files.

## 3. Application & API adapter

- [ ] 3.1 Add an HTML sanitizer dependency (e.g. `HtmlSanitizer`/Ganss.XSS) to the appropriate `Server.Application.New` project reference.
- [ ] 3.2 In the product create/update use-case in `Server.Application.New`, sanitize the incoming description (allow-list: text formatting, headings, lists, links with `href` only, images with `src`/`alt` only; strip scripts and event-handler attributes) before passing it to the domain, and verify with unit tests that a `<script>` tag and an `onclick` attribute are stripped while safe formatting (bold/italic/headings/lists/links) is preserved.
- [ ] 3.3 Wire the sanitized description through `WebApiController`'s create/update product handling so it reaches the use-case, and verify via an integration test that creating/updating a product through the API round-trips a sanitized description.

## 4. eBay listing description page

- [ ] 4.1 In `EbayLotDescriptionPage.cshtml`, render the product's description HTML (via `@Html.Raw`, guarded by a null/empty check) at the top of the page, above the existing auto-generated sections, and verify the existing sections' markup/order is otherwise unchanged.
- [ ] 4.2 Verify with a test (or documented manual check if the Razor page isn't unit-testable in isolation) that a product with no description renders the page exactly as before this change.

## 5. Frontend WYSIWYG editor

- [ ] 5.1 Add the Quill library to `Frontend` (script/link tags in `index.html`, no npm/build pipeline in this project) and a new JS interop module (e.g. `wwwroot/js/productDescriptionEditor.js`) following the existing `wwwroot/js/interop.js` ES-module pattern, exposing init/get-content functions.
- [ ] 5.2 Wire the editor into `ProductProperties.razor`: initialize it with the product's current description on load, and read its HTML content back into the update request payload on save.
- [ ] 5.3 Manually verify in the running app: create/edit a product, enter formatted text (bold, list, link) in the editor, save, reload the page, and confirm the formatting persists.

## 6. Spec coverage & docs

- [ ] 6.1 Add `[OpenSpecScenario("product-description", ...)]`-tagged tests (in `Tests.Shared`/`Tests.Unit`/`Tests.Integration` as appropriate) covering every scenario in `specs/product-description/spec.md`, and run `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh` to confirm no gaps.
- [ ] 6.2 Update `src/Ebay/AGENTS.md` to document the new `Description` field on `Product`, the sanitization approach, and the Quill/JS-interop editor pattern, per the root `AGENTS.md` "Keeping AGENTS.md up to date" rule.
- [ ] 6.3 Run `./scripts/agent-check/agent-check.sh` from the repository root and fix anything it flags.

## 7. Finalize change

- [ ] 7.1 Sync `openspec/specs/product-description/spec.md` from this change's delta spec and archive the change per the project's OpenSpec workflow.
