# Tasks

## 1. Domain and persistence

- [x] 1.1 In `Server.Domain/ProductEmailSendHistory`, rename `Seller` to `SellerKey`, add a required `SellerName`, and make `UpdateForNewAdvertisement` apply link, date, ambiguity and name only when the new date is not earlier than the stored one, keeping the contact rule unchanged; remove the stale `//todo` on `Contact` (design D4). Verify with `ProductEmailSendHistoryTests` covering the "Stored advertisement date never moves backwards" and "Seller contact is kept when a later sighting has none" scenarios of `sale-advertisement-monitoring`, tagged `[OpenSpecScenario]`.
- [x] 1.2 Add `FindAsync(unitOfWork, productId, sellerKey, marketplace, ct)` to `IProductEmailSendHistoryRepository` and implement it in the EF write-model repository; remove `FindIdAsync` from `IProductEmailSendHistoryQueries` and `ProductEmailSendHistoryQueries` (design D5). Verify that `dotnet build` succeeds and that an integration test in `Tests.Integration` finds a saved record by key and returns null for another marketplace.
- [x] 1.3 Update the write-model mapping (property and unique index `(ProductId, SellerKey, Marketplace)`) and the read model `ProductEmailSendHistoryView` / `ProductEmailSendHistoryDetails` to `SellerKey` + `SellerName`; generate the write-model migration with the EF CLI and add the `SellerName` backfill from `SellerKey` (design, Migration Plan). Verify that the migration applies to a Testcontainers database in the existing integration test run, and that `WriteModelDbContextTests` pass.
- [x] 1.4 Change `WellKnown.SaleAdvertisements.RemoveAdvertisementAfter` to 730 days (design D7). Verify with `SaleAdvertisementCleanupServiceTests` covering both scenarios of "Records expire two years after their latest advertisement date", tagged `[OpenSpecScenario]`.

## 2. Generic monitoring use case

- [x] 2.1 Replace `IChipfindAdapter` with `ISaleAdvertisementAdapter` and change `SaleAdvertisement` to `(Title, SellerKey, SellerName, Date, Link, Items)` in `Server.Application.Abstractions.Driven` (design D1, D2). Verify that `dotnet build` succeeds after task 2.2 and task 3.1 update the callers.
- [x] 2.2 Rename `ChipfindMonitoringService` to `SaleAdvertisementMonitoringService`. It takes `IEnumerable<ISaleAdvertisementAdapter>`, processes sources independently, takes the marketplace from the source, looks records up via the repository `FindAsync`, includes every line matching a newly created interesting product, uses `SellerName` in the subject, and runs the 5 s delay after `Commit`. Remove `WellKnown.ChipFind` from `Server.Application` (design D3, D5, D6). Verify by migrating `ChipfindMonitoringServiceTests` to `SaleAdvertisementMonitoringServiceTests` (`[TestOf]` updated) and covering, with `[OpenSpecScenario]`, every scenario of these `sale-advertisement-monitoring` requirements: "Advertisement lines are matched against tracked products", "One notification per product, seller and marketplace", "Sightings of non-interesting products are recorded without notification", "Marketplaces are deduplicated independently", "Notification contents", "A failed notification is retried on the next run" and "Sources are processed independently".
- [x] 2.3 Add the application `ActivitySource` and its spans (run, source, advertisement, notify) with error status on failure (design D9). Verify with `ActivityListener`-based tests in `SaleAdvertisementMonitoringServiceTests` covering both scenarios of "Monitoring is traced", and with `ArchitectureTest` still passing.
- [x] 2.4 Rename `ChipfindBackgroundTask` to `SaleAdvertisementMonitoringBackgroundTask` (and its `WellKnown` schedule entry), keeping the 20-minute period and the `IsLocalRun` switch (design D3). Verify that `dotnet build` succeeds, and that the `Server` host starts with DI validation (`ValidateOnBuild`) in the existing startup or integration tests.

## 3. chipfind adapter

- [x] 3.1 Make `ChipfindAdapter` implement `ISaleAdvertisementAdapter` with marketplace `"Chipfind"`, emit `SellerKey` (lowercased) and `SellerName` (as published), key its contact cache by `SellerKey`, and add adapter spans for the feed and page fetch (design D1, D9). Verify by updating `ChipfindAdapterTests`, including a new test for the "Seller key is lowercased and display name is kept as published" scenario of `chipfind-monitoring`, tagged `[OpenSpecScenario]`, with all existing chipfind scenarios still passing.

## 4. qrz adapter

- [x] 4.1 Create the `Server.Adapters.Driven.Qrz` project: references, `QrzAdapterOptions` (section `Qrz`; `Categories` empty by default, where empty means `["components/tubes"]`; blank category entries rejected by validation; `RequestDelay` default 5 s), keyed `IMemoryCache`, named `qrz` HTTP client, `TimeProvider`, and `AddQrzAdapter()` wired in `Server/Program.cs` (design D8). Verify that `dotnet build` succeeds (ReferenceTrimmer clean), and that `ArchitectureTest` and the host's DI validation pass.
- [x] 4.2 Save list-page and listing-page HTML fixtures from qrz.ru into `Tests.Unit`, and implement list-page parsing (id, link, Moscow-time date incl. "Сегодня"/"Вчера", malformed entries skipped). Verify with `QrzListPageParserTests` covering every scenario of the `qrz-monitoring` requirement "List page parsing", tagged `[OpenSpecScenario]`.
- [x] 4.3 Implement listing-page parsing (title, lines = title + description lines, seller key from `/user/<hash>`, display name without trailing period and "(...)" marker, skip without an author link). Verify with `QrzListingPageParserTests` covering every scenario of "Listing page content parsing" and "Listing page seller parsing", tagged `[OpenSpecScenario]`.
- [x] 4.4 Implement `QrzAdapter` as an `ISaleAdvertisementAdapter` (marketplace `"Qrz"`): first date-sorted page for types 0/2/3 per category, de-duplicated by id, listing pages cached by id + date with a delay between fetches, contact = profile URL with no HTTP request, and adapter spans (design D8, D9). Verify with `QrzAdapterTests` using a fake HTTP handler, covering every scenario of "Configured categories are polled for offers only", "Listing pages are fetched only for new or changed listings" and "Seller contact is the author's profile link", tagged `[OpenSpecScenario]`.

- [x] 4.5 Read further date-sorted list pages while a page has newly seen listings within `ListLookback` (default 2 h, at least 30 min); stop at an empty page, a page without new ids, a page with only older listings, or after `MaxListPages` (default 10) with a warning. Collect all of page 1 and only recent listings from later pages; a failed later page logs a warning and keeps earlier listings. Add both options to `QrzAdapterOptions` with range validation and update `src/Ebay/AGENTS.md` (design D8, Paging). Verify with `QrzAdapterTests` covering every scenario of "Recent list pages are read until entries get older than the lookback window" and "A failed later list page keeps the listings already collected", tagged `[OpenSpecScenario]`, and with `QrzAdapterOptionsTests` for the option ranges.

## 5. UI and documentation

- [x] 5.1 Map `SellerName` to the existing `seller` field of the sale-advertisements Web API response (design D10). Verify that the contract file is unchanged (`git diff` on `WebApi.yaml` is empty) and that the existing Web API or frontend tests pass.
- [x] 5.2 Update `src/Ebay/AGENTS.md`: add the qrz adapter to the module list, rename the ChipFind monitoring background task, and mention the `Qrz` options section. Verify by reading the diff.

## 6. Integration checks

- [x] 6.1 Run `./scripts/agent-check/agent-check.sh` from the repository root and verify it passes (build, tests, OpenSpec validation and scenario coverage).
- [x] 6.2 Run the server locally with `EbayServer:IsLocalRun=false` against a local DB and a dummy target email, and verify in the logs that one qrz run fetches 3 list pages for `components/tubes` and parses listings without warnings. Then revert the local settings.

## Workflow follow-up

- Sync specs and archive the change, then run `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh`.
