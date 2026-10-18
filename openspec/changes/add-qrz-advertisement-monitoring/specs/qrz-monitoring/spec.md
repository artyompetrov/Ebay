# Spec Delta

## Purpose

Collects sale offers from qrz.ru's classifieds board in the configured categories and turns each listing into a structured advertisement, with a stable seller key, the seller's display name and a contact link, while keeping the load on the site low.

## ADDED Requirements

### Requirement: Configured categories are polled for offers only
For each configured qrz.ru category, the system SHALL request the first list page sorted by date, once for each offer type "sell", "exchange" and "give away". It SHALL NOT request the "buy" type or any further list page. A listing returned for several offer types SHALL be collected once.

#### Scenario: One category produces three list requests
- **WHEN** the configured categories are `components/tubes` only and a collection runs
- **THEN** exactly three list pages are requested for `components/tubes`: date-sorted first pages of the sell, exchange and give-away types, and no buy-type page

#### Scenario: Listing present under two types is collected once
- **WHEN** the same listing id appears on two of the requested list pages
- **THEN** the collected advertisements contain that listing once

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
