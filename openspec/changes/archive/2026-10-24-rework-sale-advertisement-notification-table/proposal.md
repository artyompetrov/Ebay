# Proposal

## Why

The sale-advertisement notification email shows the matched advertisement lines as a list and, separately below it, a table of the products that triggered the email. To see which product a line was matched to, the reader has to compare the two blocks by eye, and an ambiguous line only gets a text marker without saying which products it matched. The emails are read mostly on a phone, where the two blocks and an unbounded table are hard to follow. The email-building code has also accumulated leftovers from earlier iterations (duplicated bookkeeping, unencoded advertisement text).

## What Changes

- **BREAKING** (email format): the list of matched lines and the separate price table are replaced by a single table with the columns `Строка объявления | Товар | Оценка | Продано шт.`.
  - One group of rows per advertisement line that matched at least one newly recorded interesting product, in advertisement order. The line cell spans all rows of its group.
  - The group lists **every** tracked product the line matched, in the same order as the tracked products are matched. Products that triggered the email (newly recorded and interesting) are shown in bold. Products that matched but did not trigger it (already recorded for the seller, or not interesting) are still listed, not bold, with their estimate.
  - A product matched by several notified lines is repeated in each line's group.
  - Lines that matched no newly recorded interesting product are not shown.
- The `[Нашлось несколько товаров]` marker is removed: a line with several products is visible from its merged cell.
- Column widths are bounded and long text wraps inside its cell instead of widening the table, so the table stays readable on a phone (a small horizontal scroll is acceptable) and does not stretch on a desktop.
- Advertisement lines, product names, the seller contact and the advertisement link are HTML-encoded in the email body.
- The notification slice follows ports and adapters:
  - The rules for what a notification contains (which lines, which products, which are triggering, estimated price) move into `Server.Domain`.
  - The application service only orchestrates and sends the domain notification through a new driven port, `ISaleAdvertisementNotificationAdapter`, which replaces `IEmailSender`.
  - The SMTP adapter renders the HTML and owns the pause between emails, which becomes the `Smtp__DelayAfterEmail` setting. That removes the service's test-only second constructor.
  - The duplicated per-advertisement bookkeeping (`notifiedLines` + `notifiedLineTexts`, `notifiedProducts` + `newInterestingProductIds`, `NotifiedLine.IsAmbiguous`) disappears.
- Unchanged: the subject format, the link to the advertisement, the contact below the table, the estimated-price formatting with the USD fallback, deduplication, the stored `IsAmbiguous` flag and its column on the sale advertisements page.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `sale-advertisement-monitoring`: "Notification contents" is replaced by "Notification consists of a link, one table and the contact" (same subject, no separate list of lines, no ambiguity marker); "Notification lists notified products with their estimated prices" is replaced by a requirement for the single line-and-product table (merged line cells, all matched products with the triggering ones highlighted, repeated products, HTML encoding, bounded column widths). "Estimated price falls back to USD without a RUB rate" is unchanged.

## Impact

- `src/Ebay/Server.Domain/SaleAdvertisements/` (new): notification composition and estimated price; `Currency.BaseCurrencyId`.
- `src/Ebay/Server.Application.Abstractions.Driven`: new `ISaleAdvertisementNotificationAdapter`; `IEmailSender` removed.
- `src/Ebay/Server.Application/SaleAdvertisements/SaleAdvertisementMonitoringService.cs`: orchestration only, one constructor; `WellKnown.SaleAdvertisements.DelayAfterEmail` removed.
- `src/Ebay/Server.Adapters.Driven.Smtp`: `SaleAdvertisementNotificationAdapter`, HTML renderer, `SmtpSettings.DelayAfterEmail`.
- Tests: domain tests, renderer tests, rewritten service tests; `Tests.Unit` references the SMTP adapter.
- `src/Ebay/AGENTS.md`: the sale-advertisement and SMTP adapter descriptions.
- Configuration: new optional `Smtp__DelayAfterEmail` (default 5 s). No API, database or frontend changes.
