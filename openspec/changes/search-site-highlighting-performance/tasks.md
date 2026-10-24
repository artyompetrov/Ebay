# Tasks

## 1. Idle-sliced matching (design D1, D3, D4, D7)

- [x] 1.1 Create `src/ChromeExtension/src/siteProcessors/searchSites/ProductHighlighter.ts` (DOM-only): injected idle scheduler interface, element queue, `TreeWalker` that skips `script`/`style`/`noscript`/`textarea`/`input`/`[contenteditable]`/tooltip and whitespace-only text, per-element union of matches, colour classes and `data-product-ids` written only on change; verify `npm test` passes with the tests of 1.3
- [x] 1.2 Add resumable slicing: check `timeRemaining()` before every `regex.test`, keep element/text node/product index position, request the next idle period when work remains; add the bounded `Map<text, MatchResult>` cache; verify with the tests of 1.3
- [x] 1.3 Add `src/ChromeExtension/tests/ProductHighlighter.test.ts` with a manual fake idle scheduler and fake products, covering the `search-site-highlighting` scenarios of "Text mentioning a known product is highlighted", "Only page text is matched", "Highlighting work runs only while the browser is idle" and "Same text appears again", each tagged `// [OpenSpecScenario(...)]`; verify `npm test` passes

## 2. Change tracking (design D2)

- [x] 2.1 Feed the queue from a `MutationObserver` (`childList`, `subtree`, `characterData`), skip detached elements, request an idle period only when the queue becomes non-empty; verify with the tests of 2.2
- [x] 2.2 Cover "Page does not change after the first pass", "Content is added to the page" and "Text stops mentioning a product" in `ProductHighlighter.test.ts` with `[OpenSpecScenario]` comments; verify `npm test` passes

## 3. Tooltip (design D5)

- [x] 3.1 Create `src/ChromeExtension/src/siteProcessors/searchSites/ProductTooltip.ts` (DOM-only): one delegated `document` `mouseover`, one tooltip element reused, products sorted by average price descending with links to `Product/{id}` in our app, close button, `mousemove` added on open and removed on close with the 300 px check once per animation frame; verify with the tests of 3.2
- [x] 3.2 Add `src/ChromeExtension/tests/ProductTooltip.test.ts` covering the scenarios of "Hovering a highlight shows the matched products" and "Hovering does not accumulate work" (count handlers through a wrapped `addEventListener`/`removeEventListener`) with `[OpenSpecScenario]` comments; verify `npm test` passes

## 4. Wiring and style (design D6, D7)

- [x] 4.1 In `SearchSitesProcessor.ts` remove the `while (true)` loop, `highlightWords`, `findMatches` and the old tooltip code; start `ProductHighlighter` with `window.requestIdleCallback` and `ProductTooltip` after products are loaded; verify `npm run build` succeeds
- [x] 4.2 Change the injected highlight styles to `background-color` only (no `font-weight`) and cover "Highlighted element keeps its font" with a test on the stylesheet text, tagged `[OpenSpecScenario]`; verify `npm test` passes
- [x] 4.3 Note the `searchSites/` modules and the idle-scheduling rule (page work only in idle callbacks, no handler per element) in `src/ChromeExtension/AGENTS.md`; verify the file describes them
- [ ] 4.4 Manually check on avito and chipfind with Chrome DevTools Performance: while scrolling no long task from the extension, after the first pass no extension activity on an idle page, highlights appear and the tooltip works; record the result in the MR

## Workflow follow-up

- Sync specs and archive the change, then run `make openspec-coverage-check`.
- Run `make agent-check` before the MR.
