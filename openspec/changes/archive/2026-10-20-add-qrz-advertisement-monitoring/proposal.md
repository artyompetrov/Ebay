# Proposal

## Why

Sale advertisements are currently collected only from chipfind.ru, and the monitoring use case (`ChipfindMonitoringService`) together with its port (`IChipfindAdapter`) is hard-wired to that one marketplace, even though matching, deduplication and notification do not depend on it. qrz.ru's classifieds board (starting with the tubes category) carries many relevant offers, and adding it requires a marketplace-neutral pipeline. On top of that, the current deduplication bookkeeping has flaws that qrz.ru would make visible: a pinned listing older than the retention window gets notified again after every cleanup, and an older advertisement can move a record's date backwards.

## What Changes

- Introduce a marketplace-neutral driven port for advertisement sources and a single application use case that runs every registered source. One source failing does not stop the others. The application layer no longer references any concrete marketplace.
- Each advertisement carries a **seller key** (a stable synthetic id when the marketplace exposes one, otherwise the visible name, normalized) and a **seller display name**. Deduplication uses the key; notifications and the UI show the display name.
- Deduplication stays "one notification per tracked product + seller key + marketplace". Additional changes:
  - the stored advertisement date never moves backwards;
  - records are kept for 2 years after the latest advertisement date instead of 90 days;
  - the write side looks records up through the write-model repository instead of the read-model query port.
- A notification lists every advertisement line that matched a newly recorded interesting product, not only the first line per product.
- Add a qrz.ru advertisement source:
  - for each configured category (initially `components/tubes`), read the list sorted by date (`?o=date`), once for each offer type: sell, exchange, give away, continuing to the next page while a page still has listings from the last 2 hours (at most 10 pages). "Buy" is excluded;
  - read the seller and the full text from each listing page, fetching a page only when the listing is new or its date has changed;
  - use the seller's profile link as the contact;
  - make no AJAX calls (the phone number stays hidden).
- chipfind.ru adapter: implement the new port and emit both the seller key and the display name.
- Add tracing spans (`ActivitySource`) across the monitoring pipeline: run, per-source fetch, per-advertisement processing, contact resolution, email send. **Exporting traces is out of scope**, since no tracer provider is configured.
- Remove the stale `TODO` on `ProductEmailSendHistory.Contact`, which describes a rule that is already implemented.
- **BREAKING (data)**: `ProductEmailSendHistory` gains a seller display name column. Existing chipfind rows keep their current `Seller` value as the key, and the display name is backfilled from it.

## Capabilities

### New Capabilities
- `sale-advertisement-monitoring`: marketplace-neutral matching of advertisement lines against tracked products, per-seller deduplication, history retention, notification contents, source isolation and tracing.
- `qrz-monitoring`: fetching and parsing qrz.ru classifieds (category list pages and listing pages) into advertisements, including the seller key, display name, contact link and listing-page caching.

### Modified Capabilities
- `chipfind-monitoring`: feed parsing now produces a seller key (the lowercased seller name) and a separate display name (the name as published), instead of only a lowercased seller name.

## Impact

- **Ports**: `Server.Application.Abstractions.Driven`. `IChipfindAdapter` is replaced by a generic source port. `SaleAdvertisement` replaces `Seller` with a seller key and a seller display name, and drops the unused `Body`. `IProductEmailSendHistoryRepository` gains a lookup by key. `IProductEmailSendHistoryQueries.FindIdAsync` is removed.
- **Application**: `ChipfindMonitoringService` becomes the generic monitoring service. The retention constant changes from 90 days to 2 years. The `WellKnown.ChipFind` marketplace constant moves into the adapter.
- **Domain**: `ProductEmailSendHistory` gets a seller display name and a date-never-decreases rule.
- **Adapters**:
  - new `Server.Adapters.Driven.Qrz` project;
  - `Server.Adapters.Driven.ChipFind` updated;
  - `Server.Adapters.Driving.BackgroundTasks`: the chipfind task becomes a generic monitoring task;
  - EF write/read model mapping and a new write-model migration;
  - `Server/Program.cs` wiring.
- **Configuration**: a new options section for the qrz category list, bound via `AddOptions().BindConfiguration()`.
- **UI / Web API**: the sale-advertisements page shows the seller display name.
- **Docs**: `src/Ebay/AGENTS.md` module list (new adapter, renamed background task).
- **External**: polls www.qrz.ru, which adds about 3 list-page requests per category every 20 minutes plus listing-page requests for new or changed listings, with a delay between requests.
