# Design

## Context

Before this change everything lived in `SaleAdvertisementMonitoringService` (`Server.Application`). It matched lines, recorded sightings, decided what to notify, built the HTML by string interpolation, sent it through the generic `IEmailSender` port and then paused for `WellKnown.SaleAdvertisements.DelayAfterEmail` "so as not to hit SMTP server limits". The pause was passed in through a second, `internal` constructor that only tests used (with `TimeSpan.Zero`). The collected state was duplicated: `notifiedLines` + `notifiedLineTexts`, and `notifiedProducts` + `newInterestingProductIds`. Only product names were HTML-encoded.

The project's rules put business rules in `Server.Domain`, use cases and ports in `Server.Application`/`Server.Application.Abstractions.Driven`, and input/output translation in adapters (see `AGENTS.md`, `src/Ebay/AGENTS.md`, the `csharp-style` skill). The old code mixed all three layers in one class.

Whether a product triggers the email is fixed at its first sighting in the advertisement: the first `RecordSightingAsync` for it returns `Created` or `Updated`, and later lines hit the per-advertisement cache.

## Goals / Non-Goals

**Goals:**
- What goes into a notification is a domain rule with no I/O: which lines, which products, which ones are triggering, and the estimated price.
- The application service only orchestrates: it loads, matches, records sightings, asks the domain for the notification and hands it to a port.
- HTML markup and SMTP throttling live in the SMTP adapter, behind a port named `*Adapter`.
- One constructor per service, with no test-only overloads.

**Non-Goals:**
- Moving the product search pattern (`ProductService.GetProductRegex`) and the "interesting product" rule (`ProductService.Map`) into `Server.Domain`. They are domain rules too, but they serve the product page and the Web API as well. Moving them is a separate change, marked with `TODO` comments at both places.
- Moving the recipient address out of `BackgroundTasksOptions.TargetEmail`; it stays a use-case argument.
- Turning the send port into `OneOf` results. It keeps throwing on SMTP failure, like `ISaleAdvertisementAdapter`, because the existing rollback-and-retry relies on the exception leaving the transaction scope.
- The stored `ProductEmailSendHistory.IsAmbiguous` flag and its column on the sale advertisements page stay as they are.

## Decisions

### Domain: `Server.Domain/SaleAdvertisements/`

- **Input:** `SaleAdvertisementLineMatch(Text, Products)` with `SaleAdvertisementProductMatch(ProductId, Name, RevenueAvgUsd, QuantityTotal, IsInteresting, IsNewlyRecorded)`. These are facts the application already has after recording a line.
- **`SaleAdvertisementNotification.Compose(title, sellerName, link, contact, lineMatches, targetRate)`** returns the notification, or `null` when nothing triggers. It applies the rules:
  - A product triggers when any of its matches in the advertisement is newly recorded and the product is interesting. Taking "any" makes a product triggered on an earlier line bold in later groups too.
  - A line is shown when it matched a triggering product. Lines keep advertisement order, and a repeated line text is shown once.
  - A shown line lists every product it matched, in match order, each with `IsTriggering`.
  - Each product gets an `EstimatedPrice`.

  Returning `null` for "nothing to notify" is not a failure, so `OneOf` is not used.
- **`EstimatedPrice(Amount, Currency)`**, `EstimatedPrice.FromUsd(revenueAvgUsd, ExchangeRate? targetRate)`. It converts with the target rate, or falls back to USD, and rounds to whole units with `MidpointRounding.AwayFromZero`. `ExchangeRate(CurrencyId, UnitsPerUsd)` is the input.
- **Base currency in the domain.** `Currency.BaseCurrencyId = "USD"` is the base currency of the existing `Currency` aggregate, which stores units per dollar. `WellKnown.CurrencyRate.BaseCurrency` now points at it instead of duplicating the literal.
- All domain types are public records or classes, because the port and the adapter use them.

### Port: `Server.Application.Abstractions.Driven/Abstractions/ISaleAdvertisementNotificationAdapter.cs`

- `Task SendAsync(string targetEmail, SaleAdvertisementNotification notification, CancellationToken cancellationToken)`.
- It replaces `IEmailSender`, whose only consumer was this service. A generic "send HTML" port would force the application to produce HTML, which is the presentation concern being moved out.

### Application: `SaleAdvertisementMonitoringService`

- Per line it records sightings exactly as before (`isAmbiguous` still goes to the history record). It then appends a `SaleAdvertisementLineMatch` with `IsNewlyRecorded = sighting == Created`.
- After all lines it calls `SaleAdvertisementNotification.Compose`. When the result is not null, it sends it through the port inside the deferred transaction (`SendNotificationAsync` keeps the span, the `throw;` after marking it, and the logs).
- `newInterestingProductIds`, the notified-lines list, the `SaleAdvertisementNotification*` records and the builder are removed from `Server.Application`.
- **One constructor.** The pause moves to the adapter, so the `delayAfterEmail` overload and `WellKnown.SaleAdvertisements.DelayAfterEmail` go away.
- **One transaction for several history aggregates is kept, deliberately.** The spec requirement "A failed notification is retried on the next run" needs every record of the advertisement rolled back when sending fails. This is the documented exception to the "one aggregate per transaction" rule, and a comment next to the transaction says so.
- `GetTargetCurrencyRateAsync` returns `ExchangeRate?`.

### Adapter: `Server.Adapters.Driven.Smtp`

- **`SaleAdvertisementNotificationAdapter : ISaleAdvertisementNotificationAdapter`.** It renders with `SaleAdvertisementNotificationHtml` (internal static), sends with the existing MailKit code (`EmailSender`, now `internal sealed` and taking a `CancellationToken`), then waits `SmtpSettings.DelayAfterEmail` (default 5 s, env `Smtp__DelayAfterEmail`).
- **Waiting after the send** is inside the application's transaction, so a notified advertisement keeps its transaction open about 5 s longer. This is acceptable for a single background job that writes only its own rows.
- **`SmtpSettings` becomes a `sealed record class` with `init` properties and a `SectionName` constant**, following the configuration rule. `[InternalsVisibleTo("Tests.Unit")]` is added to the adapter for the renderer tests.

### Markup (`SaleAdvertisementNotificationHtml`)

- **Subject:** `"{Title} [{SellerName}]"`, plain text.
- **Body:** `<a href="{encoded Link.AbsoluteUri}">ссылка</a>`, then the table, then `<div>{encoded contact}</div>` only when there is a contact.
- **Table:** `width="560"` attribute and `style="border-collapse:collapse;table-layout:fixed;width:560px;font-size:14px"`, plus `border` and `cellpadding` attributes, all from named constants.
- **Column widths:** the outer widths are 250 / 150 / 90 / 70 px (total 560; "Продано" does not fit a narrower quantity column). The header cells get the content width, which is the outer width minus padding on both sides and the border, so padding does not push the table past 560 px.
- **Cells:**
  - The line cell has `rowspan` and wraps with `overflow-wrap:anywhere;word-break:break-word;word-wrap:break-word`. The product cell wraps the same way.
  - Price and quantity cells use `white-space:nowrap`.
  - Triggering names are wrapped in `<b>`.
  - Every interpolated text is encoded with `WebUtility.HtmlEncode`.
  - The price is shown as `"{Amount:0} {Currency}"` with the invariant culture.

### Tests

- **Domain:** `SaleAdvertisementNotificationTests` and `EstimatedPriceTests` cover the composition rules and conversion/rounding without any I/O.
- **Pipeline (`SaleAdvertisementMonitoringServiceTests`):**
  - A recording fake of the port captures the domain notification and exposes its subject and body through the real `SaleAdvertisementNotificationHtml`.
  - Scenarios that depend on recording state are therefore asserted on the email exactly as it would be sent: lines shown, products listed, bold, `1232 RUB` / `15 USD`, the subject.
  - The service tests no longer need a delay parameter.
- **Markup (`SaleAdvertisementNotificationHtmlTests`):** scenarios about markup: spanning cell, encoding, widths, no text marker. Also untagged tests for bold, contact omission, subject and price formatting.
  - The `NotificationTable` parser checks that each group's `rowspan` equals its number of product rows.
- **Scenario mappings:** each scenario keeps exactly one `[OpenSpecScenario]` mapping.

## Risks / Trade-offs

- [Outlook desktop ignores `overflow-wrap`, so a long unbroken token can still widen the table] → Acceptable: the emails are read mainly on a phone; `word-break`/`word-wrap` cover most WebKit/Blink clients.
- [The Gmail app may auto-shrink a 560px email instead of scrolling] → The text stays readable when shrunk at that width; the widths are constants in the renderer.
- [The email's transaction stays open during the 5 s SMTP pause] → Only this job writes these rows; the pause could become a "minimum interval between sends" later if it matters.
- [Already recorded and non-interesting products make groups longer] → Intended (the user chose variant A); bold keeps the triggering products easy to spot.

## Migration Plan

No data change. `Smtp__DelayAfterEmail` is optional (default 5 s). The new format applies to emails sent after deployment. Rollback is a redeploy of the previous version.
