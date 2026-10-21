# Spec Delta

## MODIFIED Requirements

### Requirement: Sale advertisement feed parsing
The system SHALL fetch chipfind.ru's sale advertisement feed and parse each feed item into a title, a seller key (the seller name lowercased, since chipfind.ru exposes no synthetic seller id), a seller display name (the seller name as published), a publication date, a link, and a flat list of individual sale items extracted from the item's description - whether those items are wrapped in `<pre>` tags, mixed with plain `<br>`-separated lines, or entirely plain lines.

#### Scenario: Parses pre-formatted description items
- **WHEN** a feed item's description wraps each sale line in `<pre>` tags
- **THEN** every line is extracted as a separate sale item, and no warning is logged

#### Scenario: Parses a description mixing pre-tagged and plain lines
- **WHEN** a feed item's description mixes `<pre>`-wrapped lines with plain `<br>`-separated lines
- **THEN** all lines from both formats are extracted as sale items, and no warning is logged

#### Scenario: Parses a description of only plain lines
- **WHEN** a feed item's description contains only plain `<br>`-separated lines
- **THEN** every line is extracted as a separate sale item, and no warning is logged

#### Scenario: Seller key is lowercased and display name is kept as published
- **WHEN** a feed item's title is "Лампы 6Н2П [Ivan Petrov]"
- **THEN** the advertisement's seller key is "ivan petrov" and its seller display name is "Ivan Petrov"
