# Design

## Context

- Sale advertisement sources implement `ISaleAdvertisementAdapter` (`Server.Application.Abstractions.Driven`); `SaleAdvertisementMonitoringService` polls every registered adapter, matches `SaleAdvertisement.Items` against tracked products and deduplicates by product + seller key + marketplace (`openspec/specs/sale-advertisement-monitoring`). A new source therefore only has to produce `SaleAdvertisement`s.
- `Server.Adapters.Driven.Qrz` is the closest precedent: a named `HttpClient` with `UseScrapingProxy()`, options bound from configuration, HtmlAgilityPack parsers, a keyed `IMemoryCache` of parsed pages keyed by id + date, a request delay, and an `ActivitySource` named `Server.<project>` (exported automatically, `openspec/specs/observability-tracing`).
- newaudioportal.com runs Invision Community. Observed markup (2026-10-24):
  - section page `/forum/197-<slug>/`: topic list `ol[data-tableID='topics']`, one `li.ipsDataItem[data-rowID='<topic id>']` per topic, title link `h4.ipsDataItem_title a[href*='/topic/']`, last post time `.ipsDataItem_lastPoster time[datetime]` (ISO 8601 UTC, `...Z`); 25 topics per page, ordered by last activity; the first page currently spans about three weeks;
  - topic page `/topic/<id>-<slug>/` (page N: `.../page/N/`): title `h1.ipsType_pageTitle`, page count `data-ipsPagination-pages="N"` (absent for a one-page topic), posts `[data-role='commentFeed'] article[id^='elComment_']` (a `recommendedComments` block before the feed can hold posts too, so the feed scope matters) with author link `.cAuthorPane_author a[href*='/profile/<id>-<slug>/']`, time `time[datetime]` and body `[data-role='commentContent']`, made of `<p>` paragraphs with `<br>`; quotes are `blockquote.ipsQuote`, edit notices are `[data-excludequote]`;
  - profile URLs need a non-empty slug: `/profile/3913/` and `/profile/3913-/` are 404, `/profile/3913-anything/` redirects (301) to the canonical profile.
- The production scraping proxy is a mobile proxy; the site's CleanTalk firewall is not expected to block it.

## Goals / Non-Goals

**Goals:**
- One new driven adapter project that plugs into the existing monitoring pipeline; the only application-layer change is that a source can report an expected collection failure as a result (see Errors).
- At most one section page per configured section per run, and topic pages only for topics with new activity.

**Non-Goals:**
- The site-wide `/discover/` activity stream, the section RSS feed, or reading section pages beyond the first.
- Remembering which posts were already seen across restarts; deduplication of products stays in the shared pipeline.
- Detecting edits of the opening post that are not followed by any new post (see Risks).
- Logging in to the forum or reading private sections.

## Decisions

### Poll the section page instead of `/discover/`
`/discover/` covers the whole forum: its 25 entries span about eight hours, of which only a few belong to the section, so a burst of unrelated activity could push section events out between runs. The section page lists only relevant topics, already ordered by last activity, and carries each topic's last post time, which is exactly the change signal needed. RSS (`/forum/197-x.xml/`) has the opening post but not the last post time, so it cannot tell which topics changed. First page only (user decision): 25 topics cover weeks of activity, far more than the polling period.

### One advertisement per changed topic, rebuilt from what is visible
A topic read produces one `SaleAdvertisement`: `Title` = topic title, `Link` = topic link, `SellerKey` = opening post author's profile id, `SellerName` = their nickname, `Date` = latest post time of the starter among the read posts, `Items` = title + lines of every starter's post on the read pages (page 1 and the last page), opening post first. The adapter keeps no "seen posts" state: re-reading lines that were already matched is harmless because the shared deduplication only updates the stored record (date, link) for an already recorded product and seller. Alternative — one advertisement per new post — needs durable per-post state to survive restarts and gives nothing extra under seller-level deduplication.

### Cache key = topic id + last post time
Same pattern as qrz (`qrz-listing:{id}:{date}`): a keyed `IMemoryCache` entry `newaudioportal-topic:{id}:{lastPostUtcTicks}` with a sliding expiration holds the built advertisement, or `null` only for a topic whose opening post has no author profile link (deleted account), so it is not re-read every run. A failed fetch, a non-success status, or a page without a title or without posts (for example a firewall or captcha page answered with 200) is not cached, so the topic is retried next run. Any new post, including a buyer's reply, changes the key and triggers a re-read, which also re-reads the opening post — that is how header edits are picked up.

### First page + last page
The opening post is only on page 1; the newest posts are on the last page, whose number comes from `data-ipsPagination-pages` on page 1 (1 when absent). Middle pages are not read: their starter posts were read when they were the last page. The starter's other posts on page 1 are read as well, because the page is fetched anyway. Two requests at most per changed topic.

### Starter identification and quote removal
The starter is the author of the first post on page 1 (matching by profile id, not nickname, because nicknames can change). Posts on the read pages are kept only when their author id equals the starter id. Before turning a post into lines, `blockquote` and `[data-excludequote]` elements are removed from its body. Lines: `<br>` and the ends of block elements (`</p>`, `</div>`, `</li>`) are turned into line breaks explicitly, then tags are stripped, entities decoded, whitespace trimmed and empty lines dropped. Unlike `QrzListingPageParser.ToLines`, which relies on newlines between `<p>` elements in the source, this does not depend on how the site formats its HTML. The br/strip/de-entitize logic is now the third copy (chipfind, qrz); a shared helper would need a new shared adapter-utilities project, so it is left as a `// TODO` at the new copy rather than widened into this change.

### Contact is a profile URL built from key and name
`TryGetContactAsync` gets only the `SaleAdvertisement`, so it builds `https://newaudioportal.com/profile/{SellerKey}-{slug}/` with the slug from `SellerName` (lowercased, whitespace runs to `-`, URL-escaped, falling back to `user` when empty). The site answers 404 for an empty slug and redirects any non-empty slug to the canonical profile, so the slug does not need to match the site's own; for ordinary nicknames it does (`3550-%D0%B0%D1%80%D1%82%D1%91%D0%BC-%D0%BF`). No request is made.

### Options
Section `NewAudioPortal`: `Sections` (forum section paths such as `197-продам-радиолампы`; empty = default `[197-продам-радиолампы]`, same binder caveat as `QrzAdapterOptions.Categories`; any slug works because Invision redirects by id, but the default is the real one), `RequestDelay` (default 5 s, range 0–10 min). No lookback or page limit options: only page 1 is read.

### Errors
- Section page with a non-success status (`GetAsync` + status check, as `OpenExchangeRatesCurrencyRateSource` does) or without `[data-tableID='topics']` → `Error<string>` result, no topic page requested. A transport failure (`HttpRequestException`, timeout) is a library exception that propagates out of the adapter (marked on its span with a bare `throw;`), and the pipeline catches it as today. No `throw` statement of our own.
- Topic page transport failure (`HttpRequestException`, or `TaskCanceledException` while the run's token is not cancelled), non-success status, or a page without title/posts → warning, topic skipped, not cached.
- Malformed row → warning, skipped (rows are not cached, so a permanently malformed row, e.g. a moved-topic stub, warns every run).
- Opening post without author → warning, topic skipped and cached as `null`.
- Pinned topics are read like any other.

The "no topic list" case is an expected failure, and production code may not `throw` for it (`EBAY0001`, `src/Ebay/AGENTS.md`). Today the port can signal a failed collection only through library exceptions (`HttpRequestException` bubbling out of qrz/chipfind). So the port becomes `Task<OneOf<IReadOnlyCollection<SaleAdvertisement>, Error<string>>> GetRecentAdvertisementsAsync(...)`, following `ICurrencyRateSource`. `SaleAdvertisementMonitoringService.ProcessSourceIsolatedAsync` logs an `Error<string>` at error level and marks the source span as failed (a new `SaleAdvertisementsTracing.MarkFailed(Activity?, string)` overload that sets the error status with the message), exactly as it does for a caught exception. Its tests map to the existing `sale-advertisement-monitoring` scenarios "One failing source does not block the others" and "A failing source marks its span as an error", whose wording ("collecting advertisements ... fails") already covers a failure reported as a result. qrz and chipfind return their collections as the success case and change nothing else. Library exceptions such as HTTP failures keep propagating and being caught as before. The alternative, logging and returning an empty list, would hide a blocked page as "no new topics", which the spec rules out.

### Tracing
`ActivitySource` `Server.Adapters.Driven.NewAudioPortal` with spans `newaudioportal.section-page` (tag `section`) and `newaudioportal.topic` (tags `topic.id`, `cache.hit`, `topic.pages`), marking failures as errors — mirrors the qrz spans. The source is exported by the `Server.*` rule; it is also added to the source list in `TracingTests.SpansFromEveryApplicationSource_AreRecorded` for consistency.

### Marketplace name
`NewAudioPortal`, stored in the deduplication history like `Qrz`.

## Risks / Trade-offs

- [Opening post edited without a new post is not noticed] → it is picked up on the next post in the topic (sellers usually bump with a post); accepted by the user's "read the header when we enter the topic".
- [Cold start notifies everything on page 1] → accepted by the user: a one-off wave of redundant notifications after deployment.
- [Starter's posts on middle pages missed after a restart] → only when a topic grew by more than one page between runs; they are older posts whose lines were most likely already matched.
- [Markup changes break parsing silently] → missing topic list fails the collection; a topic page without title or posts is a warning and is retried; missing author/time per row or post logs warnings; parser tests pin the observed markup.
- [Delay between requests is not covered by a test] → same as qrz; it is a sentence of a requirement description, not a scenario.
- [Topic pages are large (images, signatures)] → at most two pages per changed topic, with a delay between requests.

## Migration Plan

Deploy as usual; no database migration. Optional configuration: `NewAudioPortal__Sections__0`, `NewAudioPortal__RequestDelay`. Rollback: remove the adapter registration; its dedup records stay under their own marketplace name and expire by the usual two-year rule.
