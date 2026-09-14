# chipfind-monitoring Specification

## Purpose

Fetching and parsing chipfind.ru's public sale-advertisement feed into structured advertisements the system can later match against tracked products, and resolving a seller's contact details from an advertisement's page so staff can be told how to reach them.

## Requirements

### Requirement: Sale advertisement feed parsing
The system SHALL fetch chipfind.ru's sale advertisement feed and parse each feed item into a title, a normalized (lowercased) seller name, a publication date, a link, and a flat list of individual sale items extracted from the item's description - whether those items are wrapped in `<pre>` tags, mixed with plain `<br>`-separated lines, or entirely plain lines. An item missing a required field (title, link, description, publication date), whose title does not match the "text [seller]" format, whose publication date cannot be parsed, or whose link is not a valid absolute URI SHALL be skipped with a logged warning, without failing the parsing of the other well-formed items in the same feed.

#### Scenario: Parses pre-formatted description items
- **WHEN** a feed item's description wraps each sale line in `<pre>` tags
- **THEN** every line is extracted as a separate sale item, and no warning is logged

#### Scenario: Parses a description mixing pre-tagged and plain lines
- **WHEN** a feed item's description mixes `<pre>`-wrapped lines with plain `<br>`-separated lines
- **THEN** all lines from both formats are extracted as sale items, and no warning is logged

#### Scenario: Parses a description of only plain lines
- **WHEN** a feed item's description contains only plain `<br>`-separated lines
- **THEN** every line is extracted as a separate sale item, and no warning is logged

#### Scenario: Malformed items are skipped without failing the feed
- **WHEN** a feed contains one item that is missing its title, link, description, or publication date, or has a title not matching the "text [seller]" format, an unparsable publication date, or an invalid link, alongside another well-formed item
- **THEN** the malformed item is skipped with a logged warning, and the well-formed item is still returned

### Requirement: Seller contact resolution from an advertisement page
For a sale advertisement, the system SHALL resolve the seller's published contact information from that advertisement's page by reading the page's "contact" section, returning it as plain text with a `mailto:` link's query string (for example a preset e-mail subject) stripped off, or the section's visible text unchanged when it contains no `mailto:` link. Once resolved for a seller, the contact SHALL be served from cache for that seller instead of being re-fetched from the advertisement page on every lookup.

#### Scenario: Contact section contains a mailto link with a subject
- **WHEN** an advertisement page's contact section contains a `mailto:` link whose href has a subject query string
- **THEN** the resolved contact string uses the link's plain address text without the query string

#### Scenario: Contact section contains a mailto link without a subject
- **WHEN** an advertisement page's contact section contains a `mailto:` link without a query string
- **THEN** the resolved contact string is the link's plain address text

#### Scenario: Contact section has no mailto link
- **WHEN** an advertisement page's contact section contains only plain text (no `mailto:` link)
- **THEN** the resolved contact string is that plain text unchanged

#### Scenario: Repeated contact lookups for the same seller are cached
- **WHEN** the seller contact is resolved twice for advertisements from the same seller
- **THEN** the second lookup is served from cache without fetching the advertisement page again
