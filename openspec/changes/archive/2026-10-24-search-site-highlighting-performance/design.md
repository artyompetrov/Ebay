# Design

## Context

See proposal.md - Why. Today `SearchSitesProcessor.ts` runs `highlightWords()` in `while (true) { ...; sleep(2000) }`. Each pass walks the whole `body` recursively, `await setTimeout(0)` every 2 nodes, and for every text node runs `regex.test` for all products (1363 products in prod; patterns built by `ProductService.GetProductRegex` with `[- ]?` between characters and look-alike classes, so they backtrack). A highlight is the parent element of the matching text nodes: classes `highlightInteresting`/`highlightChecked`/`highlightKnown`, attribute `data-product-ids`, and a `mouseenter` listener added with a fresh `bind` (so `removeEventListener` never removes it). Each hover calls `createTooltip()`, which recreates the tooltip and adds another permanent `document` `mousemove` listener that calls `getBoundingClientRect()`.

Constraints: per `src/ChromeExtension/AGENTS.md`, tested page logic lives in DOM-only modules (no `chrome.*`, no backend clients), and tests run with Node's test runner and `jsdom`, which has `MutationObserver` but no `requestIdleCallback`.

## Goals / Non-Goals

**Goals:**
- No task of ours on the host page longer than the idle time the browser grants, except a single `regex.test` call, which cannot be split.
- Zero work on a page that does not change.
- A constant number of our event handlers and tooltip elements, whatever the user hovers.

**Non-Goals:**
- Reducing the total CPU of the first pass (a per-product prefilter). It would need the backend to serve match keys derived by the same normalization as the pattern, because duplicating `ProductService` rules in TypeScript would drift and silently miss matches. Revisit as a separate change if highlighting appears too slowly after this one.
- Moving matching into the background service worker.
- Refreshing the product list on an open page after a product is created from the context menu (unchanged behavior).

## Decisions

### D1. Idle scheduling with `requestIdleCallback`, no `timeout`
Matching runs in `requestIdleCallback` callbacks and checks `deadline.timeRemaining()` before every `regex.test`. When time runs out, the current position (queue head element, text node, product index) is kept and a new idle callback is requested.
- Alternative `setTimeout(0)`/`scheduler.postTask({priority: 'background'})`: plain or low-priority tasks in the common queue; the browser does not know they must not delay a frame, and they give no time budget. That is the current problem.
- No `timeout` option: a `timeout` forces the callback to run on a busy page, which is exactly what we want to avoid. On a page that is never idle highlighting is delayed; that is the accepted rule ("if the site does nothing, we highlight").
- The scheduler is injected as a small interface (`requestIdle(callback)` with a deadline exposing `timeRemaining()`), real `window.requestIdleCallback` in production and a manual fake in tests, so the slicing scenarios are deterministic.

### D2. Work queue fed by `MutationObserver`
The first pass enqueues `body`. A `MutationObserver` (`childList`, `subtree`, `characterData`; no `attributes`, so our own class/attribute writes do not trigger it) enqueues: the target element of a `childList` mutation (its own text may have changed), every added element subtree, and the parent element of a changed text node. The queue is a `Set` of elements, so repeated mutations of one element collapse; detached elements are skipped when dequeued. An idle callback is requested only when the queue becomes non-empty, so an unchanged page requests nothing.
- Alternative: keep periodic full passes but in idle time. Still repeats all work forever and burns battery; rejected.

### D3. Element highlight computed from its own text nodes, with a text cache
As today, an element's highlight is the union of matches of its direct text-node children. Elements walked with a `TreeWalker` skip `script`, `style`, `noscript`, `textarea`, `input`, `[contenteditable]` subtrees and our tooltip; whitespace-only text is skipped. Results are cached in `Map<string, MatchResult>` keyed by the text; a cached text costs no `regex.test`. The cache is cleared when it exceeds a fixed size (e.g. 10 000 entries) to bound memory on endless feeds.

### D4. DOM writes only when the result changes
After an element's text nodes are matched, classes and `data-product-ids` are written only if the id list differs from the current attribute; no layout is read during matching, so there is no read/write interleaving.

### D5. Delegated hover and a single reused tooltip
One `mouseover` listener on `document` finds `closest('[data-product-ids]')` and shows the tooltip only when the highlighted element under the cursor changes. The tooltip element is created once and its content replaced. The `mousemove` listener that closes it at > 300 px is added when the tooltip opens and removed when it closes; it stores the latest position and does the distance check at most once per animation frame. Per-element `mouseenter` listeners go away entirely.

### D6. Background-only highlight style
The injected stylesheet sets only `background-color` for the three classes; `font-weight: bold` is removed, so a highlight change is a repaint, not a reflow.

### D7. Module split
- `src/siteProcessors/searchSites/ProductHighlighter.ts`: queue, observer, idle slicing, matching, cache, class writes (DOM-only, takes products and the idle scheduler).
- `src/siteProcessors/searchSites/ProductTooltip.ts`: delegated hover, tooltip, mouse tracking (DOM-only, takes a product lookup and the backend product URL).
- `SearchSitesProcessor.ts` keeps loading products/currency and wiring; the `while (true)` loop and old tooltip code are removed.

## Risks / Trade-offs

- [One `regex.test` on a very long text can exceed the remaining idle time] -> budget is checked before every pattern, so the overrun is bounded by a single test; accepted.
- [Pages that are never idle are never highlighted] -> accepted by the rule above; visible as missing highlight, not as lag.
- [Constantly mutating pages (tickers, timers) keep re-queuing elements] -> text cache makes repeated text free; changed text is real work and runs only in idle time.
- [Cache keyed by text holds page text in memory] -> bounded size, page-lifetime only.

## Migration Plan

Ships as a regular extension release (Chrome auto-update). Rollback is reverting the commit, which triggers a rebuild with a newer version per `chrome-extension-release`.
