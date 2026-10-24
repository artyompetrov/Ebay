# Proposal

## Why

The "Радиорынок → Продам радиолампы" section of the newaudioportal.com forum (`/forum/197-продам-радиолампы/`) is an active place where people sell valve tubes, and staff currently watch it by hand. Each topic there is one seller's advertisement that the seller keeps updating (edits the opening post, posts "sold", bumps the topic), so it fits the existing sale-advertisement monitoring pipeline as one more source.

## What Changes

- New sale advertisement source for newaudioportal.com (an Invision Community forum):
  - every run reads only the first page of each configured forum section (default: section 197), which lists topics by last activity;
  - a topic is read again only when its last-activity time has changed since it was last read;
  - each read topic becomes one advertisement of the topic starter: the topic title, the lines of the opening post (re-read every time, because sellers edit it) and of the topic starter's other posts on the first and last pages of the topic; posts by other users, quotes of other posts and edit notices are ignored;
  - the seller key is the topic starter's numeric profile id, the display name is their nickname, and the contact is the profile link;
  - a section page that fails, answers with an error status or has no topic list fails the collection instead of being read as "no topics"; a topic page that fails or has no posts is skipped and retried on the next run.
- Deduplication, notification and cold start behaviour stay those of the shared monitoring pipeline: on the first run every topic on the first page counts as new, and some redundant notifications are accepted.
- The scraping proxy rule becomes general: every source that scrapes a third-party site, including the new one, goes through the configured proxy.

## Capabilities

### New Capabilities
- `newaudioportal-monitoring`: collecting sale advertisements from the configured newaudioportal.com forum sections: which pages are read, when a topic is re-read, which posts and lines make up an advertisement, and how the seller is identified.

### Modified Capabilities
- `scraping-proxy`: the proxy requirements no longer name qrz.ru and chipfind.ru only; they apply to every source that scrapes a third-party site, and newaudioportal.com gets its own proxy-tunnelling scenario.

## Impact

- New project `src/Ebay/Server.Adapters.Driven.NewAudioPortal` (an `ISaleAdvertisementAdapter`, options section, HTML parsers with HtmlAgilityPack, keyed `IMemoryCache`, tracing span source `Server.Adapters.Driven.NewAudioPortal`), registered in `Server/Program.cs` and referenced by `Server.csproj` and the test projects.
- `ISaleAdvertisementAdapter.GetRecentAdvertisementsAsync` returns `OneOf<IReadOnlyCollection<SaleAdvertisement>, Error<string>>`, so a source can report an expected collection failure without throwing. `SaleAdvertisementMonitoringService` logs that failure like a caught exception, and the qrz and chipfind adapters wrap their results.
- Uses the existing `Server.Adapters.Driven.ScrapingProxy` (`AddScrapingProxyOptions`, `UseScrapingProxy`); no new proxy settings.
- New marketplace name in the deduplication history; no database schema change.
- Unit tests with trimmed HTML fixtures of a section page and topic pages; `ScrapingProxyRegistrationTests` and the proxy tunnelling tests gain the new HTTP client.
- Outgoing HTTP traffic to newaudioportal.com: one section page per configured section per run, plus one or two topic pages per changed topic, with a delay between requests.
