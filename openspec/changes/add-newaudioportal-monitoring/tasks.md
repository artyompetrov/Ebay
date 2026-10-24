# Tasks

## 1. Port: expected collection failure as a result

- [x] 1.1 Change `ISaleAdvertisementAdapter.GetRecentAdvertisementsAsync` to return `OneOf<IReadOnlyCollection<SaleAdvertisement>, Error<string>>`; adapt `QrzAdapter` and `ChipfindAdapter` to return their collections as the success case; make `SaleAdvertisementMonitoringService.ProcessSourceIsolatedAsync` log an `Error<string>` result at error level and mark the source span failed via a new `SaleAdvertisementsTracing.MarkFailed(Activity?, string)` overload, then continue with the other sources; adjust the `SaleAdvertisementMonitoringServiceTests` fakes and the qrz/chipfind adapter tests to the result type; verify the solution builds and `Tests.Unit` passes
- [x] 1.2 Add `SaleAdvertisementMonitoringServiceTests` for a source returning an error result (the other source is still processed; the source span has error status), mapped to `sale-advertisement-monitoring` "Sources are processed independently / One failing source does not block the others" and "Monitoring is traced / A failing source marks its span as an error"; verify the tests pass and `make openspec-coverage-check` accepts two tests per scenario

## 2. NewAudioPortal adapter project

- [x] 2.1 Create `src/Ebay/Server.Adapters.Driven.NewAudioPortal` (csproj like Qrz's plus `OneOf`, `AssemblyInfo` with `InternalsVisibleTo` like Qrz, `WellKnown`, `NewAudioPortalAdapterOptions` with `Sections` + `RequestDelay` and validation); add it to `Ebay.slnx` and `Tests.Unit.csproj`; add options tests (empty sections fall back to the default, a blank section is rejected); verify build and tests pass
- [x] 2.2 Implement the section page parser (topic id from `data-rowID`, link, last-post time from `.ipsDataItem_lastPoster time[datetime]`; malformed row skipped with a warning; missing `[data-tableID='topics']` returned as a failure) with unit tests on synthetic HTML in `Tests.Unit/Fakes/NewAudioPortalHtml.cs` mirroring the observed markup, mapped to the "Section page parsing" scenarios; verify tests pass
- [x] 2.3 Implement the topic page parser and advertisement builder (title, page count, posts from `[data-role='commentFeed'] article[id^='elComment_']` with author id/nickname, time and lines; `blockquote` and `[data-excludequote]` removed; explicit `<br>`/block-end line splitting with a `// TODO` about the duplicated helper; starter = opening post author by profile id; starter's posts on read pages only; date = starter's latest post; no author → skipped with a warning; no title or no posts → failure) with unit tests (including compact `<p>a</p><p>b</p>` markup) mapped to the "Advertisement lines come from the topic starter's posts", "Quotes and edit notices are excluded from posts", "Topic seller parsing" and "Advertisement date is the topic starter's latest post" scenarios; verify tests pass
- [x] 2.4 Implement `NewAudioPortalAdapter` and `ServiceCollectionExtensions.AddNewAudioPortalAdapter` (keyed `IMemoryCache`, `AddScrapingProxyOptions`, named `HttpClient` with `UseScrapingProxy()`; first section page only per configured section via `GetAsync` + status check; cache keyed by topic id + last-post time; first + last topic page; request delay; topic transport failure / timeout / bad status / page without posts → warning, not cached; tracing spans; contact profile URL with slug); register it in `Server.csproj` and `Program.cs`; add `NewAudioPortalAdapterTests` with a routing `HttpMessageHandler`, mapped to the remaining `newaudioportal-monitoring` scenarios; add the source to `TracingTests.SpansFromEveryApplicationSource_AreRecorded`; verify build and tests pass

## 3. Scraping proxy

- [x] 3.1 Add the newaudioportal.com client to `ScrapingProxyRegistrationTests` (no-proxy and proxy-configured checks) and a `CONNECT newaudioportal.com:443` stub-proxy test in `NewAudioPortalAdapterTests`, mapped to the new `scraping-proxy` scenario; verify tests pass

## 4. Documentation and checks

- [x] 4.1 Update `src/Ebay/AGENTS.md`: add `Server.Adapters.Driven.NewAudioPortal` (sections from the `NewAudioPortal` options section, `NewAudioPortal__Sections__0=...`) to the sale advertisement sources list, extend the adapter-private cache example, note that `GetRecentAdvertisementsAsync` returns `OneOf<..., Error<string>>` for an expected collection failure, and replace "(qrz, chipfind)" in the `ScrapingProxy` entry with general wording; verify by reading the diff
- [x] 4.2 Run `make agent-check` and verify it passes (build, tests, OpenSpec validation and coverage with this change's deferral)

## Workflow follow-up

- Review the implementation (`openspec-verify-change` in a subagent).
- When syncing specs, update the Purpose of `openspec/specs/scraping-proxy/spec.md` by hand: it names "(qrz.ru, chipfind.ru)", and a delta does not change Purpose.
- Archive the change and run `make openspec-coverage-check`.
