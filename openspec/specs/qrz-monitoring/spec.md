# qrz-monitoring Specification

## Purpose

Collects sale offers from qrz.ru's classifieds board in the configured categories and turns each listing into a structured advertisement, with a stable seller key, the seller's display name and a contact link, while keeping the load on the site low.

## Requirements

### Requirement: Configured categories are polled for offers only
For each configured qrz.ru category, the system SHALL read the list sorted by date, once for each offer type "sell", "exchange" and "give away", starting from the first page. It SHALL NOT request the "buy" type. A listing returned for several offer types or pages SHALL be collected once.

#### Scenario: One category produces three list requests
- **WHEN** the configured categories are `components/tubes` only, every first-page entry is older than the lookback window, and a collection runs
- **THEN** exactly three list pages are requested for `components/tubes`: date-sorted first pages of the sell, exchange and give-away types, and no buy-type page

#### Scenario: Listing present under two types is collected once
- **WHEN** the same listing id appears on two of the requested list pages
- **THEN** the collected advertisements contain that listing once

### Requirement: Recent list pages are read until entries get older than the lookback window
Within one category and offer type, the system SHALL request the next list page while the current page has a newly seen listing within the lookback window (default 2 hours). Paging SHALL stop at a page that is empty, adds no new listing, or has only listings older than the window, and after the page limit (default 10) with a logged warning. Every listing on the first page SHALL be collected; later pages SHALL contribute only listings within the window.

#### Scenario: Next page is read while the page has recent entries
- **WHEN** the first sell page has a listing from 30 minutes ago, the second page has one listing from 30 minutes ago and one from 4 hours ago, and the third page has only listings from 4 hours ago
- **THEN** exactly the first three sell pages are requested

#### Scenario: Later pages contribute only recent listings
- **WHEN** the first sell page has a listing from 30 minutes ago and one from 4 hours ago, and the second page has one listing from 30 minutes ago and one from 4 hours ago
- **THEN** both first-page listings and only the recent second-page listing are collected

#### Scenario: Paging stops at a page older than the lookback window
- **WHEN** every listing on the first page of each offer type is older than the lookback window
- **THEN** no second page is requested, and the first-page listings are collected

#### Scenario: Paging stops at an empty page
- **WHEN** the first sell page has a recent listing and the second sell page has no entries
- **THEN** exactly the first two sell pages are requested

#### Scenario: Paging stops at a page without new listings
- **WHEN** qrz.ru returns the same page with a recent listing for every page number
- **THEN** exactly the first two sell pages are requested

#### Scenario: Paging stops at the page limit
- **WHEN** every sell page has a new recent listing and the page limit is 3
- **THEN** exactly three sell pages are requested, their listings are collected, and a warning is logged

### Requirement: A failed later list page keeps the listings already collected
If a list page after the first cannot be fetched, the system SHALL log a warning, stop paging that category and offer type, and keep the listings collected from earlier pages. A failure on the first page SHALL fail the collection as before, so the monitoring run logs it as an error.

#### Scenario: Failure on the second page keeps first-page listings
- **WHEN** the first sell page has a recent listing and the request for the second sell page fails
- **THEN** the first-page listing is collected, no further sell page is requested, and a warning is logged

### Requirement: List page parsing
The system SHALL extract from each list-page entry the listing id (the number after the last underscore of its `/classifieds/detail/` link), the absolute listing link and the publication date. Dates SHALL be read as Moscow time (UTC+3), either as `dd.MM.yyyy HH:mm` or as "Сегодня HH:mm" / "Вчера HH:mm" relative to the current Moscow date. An entry without a parsable id, link or date SHALL be skipped with a logged warning, without failing the other entries.

#### Scenario: Absolute date is parsed as Moscow time
- **WHEN** a list entry links to `/classifieds/detail/radiolampy-6s19p-w_439891` and shows `17.10.2026 06:36`
- **THEN** the listing id is 439891, the link is `https://www.qrz.ru/classifieds/detail/radiolampy-6s19p-w_439891`, and the date is 2026-10-17 06:36 +03:00

#### Scenario: Relative date is resolved against the current Moscow date
- **WHEN** a list entry shows `Сегодня 11:19` and the current time is 2026-10-18 15:00 Moscow time
- **THEN** the listing date is 2026-10-18 11:19 +03:00

#### Scenario: Entry with an empty slug is still parsed
- **WHEN** a list entry links to `/classifieds/detail/_469874`
- **THEN** the listing id is 469874

#### Scenario: Malformed entry is skipped
- **WHEN** a list page has one entry whose date cannot be parsed, alongside a well-formed entry
- **THEN** the malformed entry is skipped with a logged warning, and the well-formed entry is collected

### Requirement: Listing page content parsing
For each collected listing, the system SHALL read its listing page and take the title from the page heading. The advertisement lines SHALL be the title followed by each non-empty line of the description. The title is included because qrz.ru listings often name the item only there.

#### Scenario: Listing page yields title and lines
- **WHEN** a listing page has the heading "Продам гс,тр,ги,гу,гм.тги" and a description of `<br />`-separated lines "ТГИ2-400/16-32шт, по 8000р" and "ГУ-108Б-10шт по 5000р"
- **THEN** the advertisement has that title and exactly three lines: the title followed by those two description lines

### Requirement: Listing page seller parsing
The seller key SHALL be the hash from the author's profile link `/user/<hash>` on the listing page. The seller display name SHALL be the author field without a trailing period or a parenthesized marker such as "(организация)". A listing page without an author profile link SHALL be skipped with a logged warning.

#### Scenario: Listing page yields seller key and display name
- **WHEN** a listing page shows the author "Евгений Смирнов (организация)." linking to `/user/968d583acd6460911adbe0e9f5e97edb`
- **THEN** the advertisement has seller key `968d583acd6460911adbe0e9f5e97edb` and display name "Евгений Смирнов"

#### Scenario: Listing page without an author link is skipped
- **WHEN** a listing page has no link to an author profile
- **THEN** the listing is not returned, and a warning is logged

### Requirement: Listing pages are fetched only for new or changed listings
The system SHALL fetch a listing page only when that listing id has not been read yet with the same publication date. Otherwise it SHALL reuse the previously parsed result. Consecutive listing-page requests SHALL be separated by a delay.

#### Scenario: Unchanged listing is not fetched again
- **WHEN** a listing with id 439891 and date 2026-10-17 06:36 was already read, and a later collection sees the same id with the same date
- **THEN** the listing page is not requested again, and the previously parsed advertisement is returned

#### Scenario: Re-dated listing is fetched again
- **WHEN** a listing that was read with date 2026-10-16 20:47 appears with date 2026-10-18 11:19
- **THEN** its listing page is requested again

### Requirement: Seller contact is the author's profile link
The contact of a qrz.ru advertisement SHALL be the absolute URL of the author's profile page (`https://www.qrz.ru/user/<hash>`). The system SHALL NOT make any request to reveal a hidden phone number or to otherwise obtain contact details.

#### Scenario: Contact is the profile URL
- **WHEN** the contact is resolved for an advertisement whose seller key is `af7abbd4175636376db6b7c22d1809c8`
- **THEN** the contact is `https://www.qrz.ru/user/af7abbd4175636376db6b7c22d1809c8`, and no HTTP request is made to resolve it
