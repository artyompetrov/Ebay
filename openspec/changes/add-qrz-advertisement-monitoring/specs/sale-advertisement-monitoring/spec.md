# Spec Delta

## Purpose

Turns sale advertisements collected from any supported marketplace into at most one notification per tracked product and seller, so staff learn about interesting offers without being told about the same seller's product again and again.

## ADDED Requirements

### Requirement: Advertisement lines are matched against tracked products
The system SHALL match every line of a collected advertisement against the search patterns of all tracked products. A line that matches no product SHALL be ignored. A line that matches more than one product SHALL be treated as ambiguous for each of those products.

#### Scenario: A line matching one product is attributed to it
- **WHEN** an advertisement has the lines "Лампа 6Н2П новая" and "Конденсатор К73", and only product 6Н2П matches
- **THEN** a sighting of product 6Н2П is recorded for the advertisement's seller as not ambiguous, and nothing is recorded for the second line

#### Scenario: A line matching several products is ambiguous
- **WHEN** an advertisement line matches two tracked products
- **THEN** a sighting is recorded for each of the two products, both marked as ambiguous

### Requirement: One notification per product, seller and marketplace
The system SHALL deduplicate sightings by tracked product, seller key and marketplace. The first sighting of such a combination SHALL be recorded and, when the product is interesting, notified. Later sightings of the same combination SHALL update the stored record, even from a different advertisement or at a different price, and SHALL NOT be notified.

#### Scenario: First sighting of an interesting product is notified
- **WHEN** an interesting product is matched in an advertisement from a seller who has no record for that product on that marketplace
- **THEN** a record is created for that product, seller key and marketplace, and one notification is sent

#### Scenario: Repeated sighting is not notified again
- **WHEN** a seller who already has a record for an interesting product publishes a new advertisement with that product on the same marketplace
- **THEN** no notification is sent, and the record's link and advertisement date are updated to the new advertisement

#### Scenario: Several advertisement lines for the same product create one record
- **WHEN** two lines of one advertisement both match the same interesting product, and the seller has no record for it
- **THEN** exactly one record is created for that product and seller, and exactly one notification is sent for the advertisement

### Requirement: Sightings of non-interesting products are recorded without notification
The system SHALL record the first sighting of a product that is not interesting, exactly as for an interesting one, but SHALL NOT send a notification for it. Because such a record already exists, the same seller's product SHALL NOT be notified later, even after the product becomes interesting, until the record expires.

#### Scenario: Non-interesting product is recorded silently
- **WHEN** a non-interesting product is matched in an advertisement from a seller with no record for it
- **THEN** a record is created and no notification is sent

#### Scenario: Product that became interesting is not notified for an already recorded seller
- **WHEN** a product that was recorded for a seller while not interesting becomes interesting, and the same seller advertises it again
- **THEN** no notification is sent

### Requirement: Marketplaces are deduplicated independently
The seller key SHALL be scoped to the marketplace it came from. Sightings of the same product on different marketplaces SHALL be recorded and notified separately, even when the seller keys look identical.

#### Scenario: Same seller key on two marketplaces
- **WHEN** an interesting product is matched for seller key "ivanov" on one marketplace, and the same product is later matched for seller key "ivanov" on another marketplace
- **THEN** two records exist, one per marketplace, and two notifications are sent

### Requirement: Stored advertisement date never moves backwards
When a record is updated by a later sighting, its advertisement date SHALL become the later of the stored date and the sighting's publication date. Its link SHALL point to the advertisement with that later date.

#### Scenario: A newer advertisement moves the date forward
- **WHEN** a record dated 2026-10-01 is sighted again in an advertisement published on 2026-10-15
- **THEN** the record's advertisement date becomes 2026-10-15, and its link points to the new advertisement

#### Scenario: An older advertisement does not move the date back
- **WHEN** a record dated 2026-10-15 is sighted again in an advertisement published on 2026-06-20
- **THEN** the record's advertisement date and link stay those of the 2026-10-15 advertisement

### Requirement: Seller contact is kept when a later sighting has none
When a record is updated by a later sighting without a contact, the stored contact SHALL be kept. A non-empty contact from a later sighting SHALL replace it.

#### Scenario: Sighting without a contact keeps the stored one
- **WHEN** a record with contact "seller@example.com" is sighted again and no contact could be resolved for the new advertisement
- **THEN** the record's contact stays "seller@example.com"

### Requirement: Records expire two years after their latest advertisement date
The system SHALL delete deduplication records whose advertisement date is more than two years in the past, and SHALL keep every other record.

#### Scenario: Record older than two years is removed
- **WHEN** the cleanup runs on 2026-10-18 and a record's advertisement date is 2024-10-17
- **THEN** that record is deleted

#### Scenario: Record within two years is kept
- **WHEN** the cleanup runs on 2026-10-18 and a record's advertisement date is 2026-06-20
- **THEN** that record is kept

### Requirement: Notification contents
A notification SHALL be sent per advertisement that produced at least one newly recorded interesting product. Its subject SHALL be the advertisement title followed by the seller display name in square brackets. Its body SHALL contain a link to the advertisement, every advertisement line that matched a newly recorded interesting product (each ambiguous line marked as matching several products), and the seller contact when one was resolved.

#### Scenario: All matching lines appear in the notification
- **WHEN** two lines of one advertisement match the same newly recorded interesting product
- **THEN** the notification body contains both lines

#### Scenario: Subject uses the seller display name
- **WHEN** an advertisement titled "Радиолампы" from a seller with key "968d583acd6460911adbe0e9f5e97edb" and display name "Евгений Смирнов" is notified
- **THEN** the notification subject is "Радиолампы [Евгений Смирнов]"

#### Scenario: Ambiguous line is marked
- **WHEN** a notified line matched more than one tracked product
- **THEN** that line is marked in the body as matching several products

### Requirement: A failed notification is retried on the next run
If sending a notification fails, the records created or updated for that advertisement SHALL NOT be persisted, so the next run treats the sighting as new and tries to notify again.

#### Scenario: Email failure leaves no record behind
- **WHEN** a new interesting product is matched and sending its notification fails
- **THEN** no record is persisted for that product and seller, and the next run sends the notification again

### Requirement: Sources are processed independently
Each monitoring run SHALL process every configured advertisement source. A failure while collecting or processing one source SHALL be logged and SHALL NOT prevent the other sources from being processed in the same run.

#### Scenario: One failing source does not block the others
- **WHEN** a run covers two sources and collecting advertisements from the first one fails
- **THEN** the error is logged and advertisements from the second source are still processed and notified

### Requirement: Monitoring is traced
The monitoring pipeline SHALL emit tracing spans for:
- each run;
- each source's collection, tagged with the marketplace;
- each processed advertisement, tagged with the marketplace, the seller key and the number of matched products;
- each notification sent.

A failure inside a span SHALL mark that span as an error.

#### Scenario: A run produces nested spans
- **WHEN** a run processes one source with one advertisement that produces a notification, while a tracing listener is attached
- **THEN** the listener receives a run span with a source-collection span tagged with the marketplace, an advertisement span tagged with the marketplace, seller key and match count, and a notification span

#### Scenario: A failing source marks its span as an error
- **WHEN** collecting advertisements from a source fails while a tracing listener is attached
- **THEN** that source's span has error status
