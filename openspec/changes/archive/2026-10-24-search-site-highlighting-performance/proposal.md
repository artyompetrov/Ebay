# Proposal

## Why

When the extension highlights known products on third-party sites (avito, chipfind and any other site in Supplier mode), those sites scroll with visible lag. The highlighting re-scans the whole page every 2 seconds forever, runs all ~1400 product patterns on every text node in tasks that compete with the site's own work, and leaks a document-wide `mousemove` handler with a forced layout every time a highlight is hovered. The intent was always "work in the background, yield eagerly, compute only while the site is idle", but the implementation does not deliver it.

## What Changes

- Highlighting work runs only in browser idle periods and stops as soon as the idle period ends, resuming in the next one; no slice of it holds the main thread longer than the browser allows.
- After the first pass the page is processed again only where it actually changed (added content, changed text); an unchanged page costs nothing.
- Text that is never shown as page text (scripts, styles, editable fields) and whitespace-only text is not matched; repeated identical text is matched once.
- Hovering highlights no longer adds handlers: one hover handler for the whole page, one reused tooltip, and mouse tracking only while the tooltip is open.
- Highlight style changes to background colour only (no bold), so highlighting never changes text layout.
- No backend or API changes; matching keeps using the product patterns the backend already serves.

## Capabilities

### New Capabilities
- `search-site-highlighting`: highlighting of known products in the text of third-party sites, the product tooltip on hover, and the limits this work puts on the host page's responsiveness.

### Modified Capabilities

## Impact

- `src/ChromeExtension/src/siteProcessors/SearchSitesProcessor.ts`: the highlighting loop, tooltip and styles are replaced; the matching, change tracking and tooltip logic move into DOM-only modules so they can be tested with jsdom.
- `src/ChromeExtension/tests`: new tests mapped to the `search-site-highlighting` scenarios.
- Visual: highlighted text is no longer bold.
- New extension version is released (extension inputs change), see `openspec/specs/chrome-extension-release`.
