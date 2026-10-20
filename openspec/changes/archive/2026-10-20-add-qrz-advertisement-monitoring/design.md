# Design

## Context

Current pipeline (see proposal.md - Why for motivation):

```
ChipfindBackgroundTask (20 min, error delay 5 min, skipped when IsLocalRun)
  -> ChipfindMonitoringService.ProcessRecentAdvertisementsAsync(targetEmail)
       -> IChipfindAdapter.GetRecentSaleAdvertisements      (RSS)
       -> per advertisement, one unit of work:
            per line: regex match (ProductService.GetProductRegex)
                      IChipfindAdapter.TryGetAdvertisementContactAsync (page fetch, memory cache per seller)
                      IProductEmailSendHistoryQueries.FindIdAsync -> repository.GetByIdAsync
                      Create / UpdateForNewAdvertisement
            transaction: SaveChanges -> email -> 5 s delay -> Commit
SaleAdvertisementCleanupBackgroundTask (daily) -> RemoveOlderThanAsync(now - 90 days)
```

Constraints that shape the design (from `src/Ebay/AGENTS.md`):
- `Server.Application` references no adapter and no external assembly except DI and logging abstractions. `System.Diagnostics.ActivitySource` is a framework assembly and is allowed.
- Driven adapters depend only on `Server.Application.Abstractions.Driven` and the domain.
- Every service is a stateless singleton. HTTP goes through `IHttpClientFactory` with named clients.
- Options are bound with `AddOptions().BindConfiguration().ValidateDataAnnotations().ValidateOnStart()`.
- Commands go through repositories. Query ports are not used to perform writes.
- Business rules live in `Server.Domain`.

qrz.ru markup observed on 2026-10-18:
- **List page.** Each entry is a `div.adv_row`. The date is in `span.adv_date` (`Сегодня 11:19` or `17.10.2026 06:36`). The link is `span.Title a[href^="/classifieds/detail/"]`, formatted as `<slug>_<id>`; the slug may be empty.
- **Offer-type filter.** The type is set with the `type` query parameter: `0` sell, `1` buy, `2` exchange, `3` give away. Only one value is allowed per request. Sorting by date is `o=date`.
- **Listing page.** The title is in `h1`. The author block is `div.adv_settings`: `Автор: <name> (организация).` plus `a[href^="/user/<hash>"]`. The description is in `div.classified_full_body` as `<p>` with `<br />`-separated lines.
- **Phone.** The phone number is hidden behind an AJAX endpoint, which we do not call.
- **Offer type is not shown on the list.** The listing page heading carries it as a prefix ("Продам ..."), so collection is done with one request per type.

## Goals / Non-Goals

**Goals:**
- The application layer has no knowledge of concrete marketplaces. Adding a marketplace only means adding an adapter project and registering it.
- Keep the existing transaction and retry semantics of a notification.

**Non-Goals:**
- Tracer provider and OTLP trace export (`WithTracing`) are out of scope. Spans are emitted but not collected yet.
- Moving email sending into the transactional outbox. The duplicate email when a shutdown hits between send and commit is accepted.
- Persistent (DB) caching of qrz.ru listing pages.
- Matching sellers across marketplaces.

## Decisions

### D1. One generic source port, many registrations
The port is named `ISaleAdvertisementAdapter`, following the project rule that adapter-boundary ports are named `*Adapter`.

`Server.Application.Abstractions.Driven/Abstractions/ISaleAdvertisementAdapter`:

```
string Marketplace { get; }
Task<IReadOnlyCollection<SaleAdvertisement>> GetRecentAdvertisementsAsync(CancellationToken)
Task<string?> TryGetContactAsync(SaleAdvertisement, CancellationToken)
```

Each adapter registers its own implementation with `AddSingleton<ISaleAdvertisementAdapter, ...>()`. The application service takes `IEnumerable<ISaleAdvertisementAdapter>`. The marketplace string is now owned by the adapter:
- chipfind keeps the exact value `"Chipfind"`, so existing history rows still match;
- qrz uses `"Qrz"`.

Contact resolution stays lazy and separate from collection. Chipfind needs an extra page request per seller, so the request is made only when a line matched a product. qrz returns the profile URL and does no IO.

*Alternative considered:* return the contact inside `SaleAdvertisement`. Rejected: chipfind would then fetch a page for every advertisement, not only for matching ones.

### D2. `SaleAdvertisement` model
`SaleAdvertisement(string Title, string SellerKey, string SellerName, DateTimeOffset Date, Uri Link, string[] Items)`.
- `Seller` is split into `SellerKey` and `SellerName`.
- `Body` is removed: nothing reads it.
- No marketplace field: the service always knows which source produced the advertisement.
- No external id: only the qrz adapter needs the listing id, for its own cache.

### D3. One background task iterates all sources
`ChipfindBackgroundTask` becomes `SaleAdvertisementMonitoringBackgroundTask`, keeping the 20-minute period and the `IsLocalRun` switch. It calls `SaleAdvertisementMonitoringService.ProcessRecentAdvertisementsAsync(targetEmail, ct)`. The service processes the sources one after another and wraps each in try/catch:
- a failure is logged at error level and marks the source span as an error;
- the next source is processed anyway;
- cancellation is rethrown.

*Alternative considered:* one hosted service per source. Rejected: the driving adapter would then have to know marketplace names, and both sources use the same period today. A per-source period can later become a property of the port.

### D4. Domain: `ProductEmailSendHistory`
- `Seller` is renamed to `SellerKey` (same column data). A new `SellerName` is added (required).
- `UpdateForNewAdvertisement(link, advertisementDate, isAmbiguous, sellerName, contact)`:
  - if `advertisementDate >= AdvertisementDate`, set `Link`, `AdvertisementDate`, `IsAmbiguous` and `SellerName` from the sighting; otherwise leave them unchanged;
  - `Contact` keeps its rule (a non-empty value replaces, an empty one is ignored) regardless of the date. A contact is a property of the seller, not of one advertisement.
- The stale `//todo` on `Contact` is removed.

These rules live in the aggregate, not in the service, so the command side stays "load aggregate -> domain method -> commit".

### D5. Write-side lookup by key
`IProductEmailSendHistoryRepository.FindAsync(unitOfWork, productId, sellerKey, marketplace, ct)` replaces the pair `IProductEmailSendHistoryQueries.FindIdAsync` + `GetByIdAsync`. `FindIdAsync` is removed from the query port and its implementation; `GetForProductAsync` stays for the UI. The per-advertisement dictionary of already loaded or created aggregates stays: records created in the current unit of work are not yet in the database.

### D6. Notification assembly
Per advertisement, the service tracks the set of product ids whose record was **created** while processing this advertisement and which are interesting. A line goes into the email when any product it matched is in that set at the time the line is processed. Lines keep their advertisement order and are not repeated. Because the first line creates the record, a second line for the same product then sees it in the set and is included too. The subject and body format stay as today (`<a href=link>ссылка</a>`, `<div>` per line, `[Нашлось несколько товаров]` marker, contact). The subject uses `SellerName`.

Transaction order: `SaveChanges -> Send -> Commit`, after which comes the 5-second delay. Moving the delay after the commit costs nothing and avoids the cancellation-during-delay duplicate.

### D7. Retention
`WellKnown.SaleAdvertisements.RemoveAdvertisementAfter = TimeSpan.FromDays(730)`. The cleanup task and query are unchanged.

### D8. qrz adapter: `Server.Adapters.Driven.Qrz`
- **Options.** `QrzAdapterOptions` is bound to section `Qrz`. `Categories` is a string[] that is empty by default; empty means the built-in default `["components/tubes"]`, so production needs no new configuration. It can be overridden via `Qrz__Categories__0=...` in the compose environment. A non-empty array initializer is not used because the configuration binder appends configured items to existing array elements instead of replacing them. Blank category entries (for example `Qrz__Categories__0=`) fail options validation at startup. `RequestDelay` (default 5 s, like chipfind) is applied after every request to qrz.ru, list pages included.
- **Collection.** For each category and each type in {0, 2, 3}, the adapter calls `GET https://www.qrz.ru/classifieds/category/<category>?o=date&type=<t>` (then `&p=2`, `&p=3`, ...) and parses the entries. It de-duplicates by listing id and keeps the latest date.
- **Paging.** One page holds 50 entries, and sellers re-raise listings in bulk: on 2026-10-20 about 70 tube listings were raised within 10 minutes, so a GU-50 listing left the first page about 3 minutes after it was raised and a 30-minute poll missed it. The adapter therefore reads the next page while the current one has a newly seen listing within `ListLookback` (default 2 h, which covers the poll period, the run time and a margin). It stops at the first page that is empty (qrz.ru returns an empty page past the last one), adds no new listing id (a guard against the site repeating a page), or has only listings older than the window; it also stops at `MaxListPages` (default 10) with a warning. A date cutoff is used instead of "stop at the first old entry" because the date order is not strict: a pinned premium entry stays on top, and some entries appear out of order. Every entry on page 1 is collected as before; later pages contribute only entries within the window, so a cold start after a restart does not fetch a whole page of old listings for each extra page read. A failed request for page 2 or later (HTTP error or timeout) is logged as a warning and keeps what was already collected; listings it hid are picked up by the next run while they are still inside the window. A failure on page 1 still fails the qrz run, as before. `ListLookback` must be at least 30 minutes (the poll period): a shorter window would silently turn paging off.
- **Listing pages.** For each listing, the adapter looks up the keyed `IMemoryCache` with key `qrz-listing:<id>:<date ticks>`. On a miss it fetches the listing page, parses it, stores the result (sliding expiration 14 days), then waits for the delay. A listing page that fails to parse is cached as "skipped" for the same key, so a broken page is not refetched every run; it is retried only when its date changes. A failed HTTP request for a listing page is logged as a warning and not cached, so the page is retried on the next run.
- **Time.** `TimeProvider` is injected; the adapter registers `TimeProvider.System` with `TryAddSingleton`. Moscow time is a fixed offset `+03:00`: Russia has had no DST since 2014, and a fixed offset avoids depending on tzdata. "Вчера" is handled as well, although it has not been observed yet.
- **Contact.** `https://www.qrz.ru/user/<SellerKey>`.
- **HTTP.** The adapter uses the named client `qrz` with a browser-like `User-Agent`.
- **Parsing.** HtmlAgilityPack, already used by chipfind. List and listing-page parsing are separate internal classes, tested from saved HTML fixtures.

*Alternative considered:* RSS `https://www.qrz.ru/rss`. Rejected: it is a single feed for all categories, holds only 20 items (about 10 minutes of activity), and has no category filter.

### D9. Tracing
- The application defines `ActivitySource("Server.Application.SaleAdvertisements")` with spans:
  - `sale-advertisements.run`;
  - `sale-advertisements.source` (tag `marketplace`);
  - `sale-advertisements.advertisement` (tags `marketplace`, `seller.key`, `matches.count`, `link`);
  - `sale-advertisements.notify`.
- Each adapter has its own source (`Server.Adapters.Driven.Qrz`, `Server.Adapters.Driven.ChipFind`) with spans for list/feed fetch and listing-page fetch (tag `cache.hit`).
- On exception: `SetStatus(ActivityStatusCode.Error)` plus an exception event.
- Source names live in each assembly's `WellKnown`, so a future `WithTracing().AddSource(...)` in `Server.Platform` can reference them.
- Tests use an `ActivityListener`.

### D10. UI / Web API
The sale-advertisements endpoint maps `SellerName` to its existing `seller` field. The contract is unchanged, and the page shows the display name instead of the key.

## Risks / Trade-offs

- [qrz.ru markup changes] → Entries or pages are skipped with warnings, without failing the run. Parsers are covered by fixtures saved from the live site.
- [Too many requests after a restart: the memory cache is empty, so every first-page listing (up to 50 per offer type, about 150) plus the recent listings from later pages are fetched with a 5 s delay, typically about 12-15 minutes] → Acceptable once per deploy. A persistent cache can be added later if it becomes a problem.
- [Ban or rate limiting] → Usually 3 to 6 list requests per category per run (first pages plus one extra page while there are fresh entries), at most `MaxListPages` per type, a delay between all requests, no AJAX.
- [Downtime longer than `ListLookback`, or a bulk re-raise of more than about `MaxListPages` × 50 listings within the window, misses listings] → Accepted. The page limit logs a warning when it is reached.
- [The display name changes over time] → The key is unaffected, and the latest name is stored on update.
- [Renaming `Seller` to `SellerKey` touches the EF mapping, the read model and the unique index] → One migration generated via the EF CLI, with a backfill of `SellerName` from the key for existing rows.

## Migration Plan

1. Write-model migration `SplitSaleAdvertisementSellerKeyAndName`, generated with the EF CLI. EF maps the old `Seller` column to `SellerName` (rename) and adds `SellerKey`. One hand-added line, `UPDATE ... SET "SellerKey" = "SellerName"`, runs before the new unique index `(ProductId, SellerKey, Marketplace)` is created; without it every row would get an empty key and the index would fail. Existing chipfind rows therefore keep their former value as the key, and the display name gets the same lowercased value until the next sighting refreshes it.
2. Deploy as usual. Chipfind keeps working with the same history, since the marketplace value and the key are unchanged.
3. Rollback: the down migration copies `SellerKey` into `SellerName`, drops `SellerKey` and renames `SellerName` back to `Seller`, so the previous image sees its original keys. Up and down were verified on a scratch Postgres 16 holding rows in the old format.
