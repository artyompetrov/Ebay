# measurement-matching Specification

## Purpose

Pairing two measurements together into a matched set via a shared match id, and keeping any already-cached rendered content (curve plots, tube descriptions, photos) correct for everyone affected whenever a measurement's lifecycle status or pairing changes.

## Requirements

### Requirement: Assigning or changing a measurement's match pairing
Staff SHALL be able to set, change, or clear a measurement's match id, identifying it as paired with other measurements that share the same id. Blank or whitespace-only input SHALL be treated as "not paired" (a null match id); non-blank input SHALL be trimmed before being compared or stored. The system SHALL persist the change and raise a match-pairing-changed notification only when the normalized match id actually differs from the measurement's current one.

#### Scenario: Assigning a match id updates the pairing and notifies of the change
- **WHEN** a measurement's match id is set to a new value whose normalized form differs from its current match id
- **THEN** the measurement's match id is updated to the trimmed value, and a match-pairing-changed notification is raised carrying the old and new match id

#### Scenario: Re-submitting the same normalized match id is a no-op
- **WHEN** a measurement's match id is set to a value whose trimmed form equals its current match id
- **THEN** the measurement is left unchanged, no notification is raised, and nothing is persisted

### Requirement: Cache invalidation follows lifecycle and pairing changes
Whenever a measurement's lifecycle status changes, the system SHALL invalidate that measurement's cached rendered content. Whenever a measurement's match pairing changes, the system SHALL invalidate the cached rendered content of the measurement itself and of every other measurement currently sharing its old or new match id, since a paired measurement's own rendered comparison depends on its partner's data.

#### Scenario: A status change invalidates that measurement's cache
- **WHEN** a measurement's lifecycle status changes
- **THEN** the system invalidates the cached rendered content for that measurement

#### Scenario: A pairing change invalidates the cache of the measurement and both its former and new pair partners
- **WHEN** a measurement's match id changes from one pairing group to another
- **THEN** the system invalidates the cached rendered content for the changed measurement itself, for every other measurement that shared its old match id, and for every other measurement that shares its new match id, while leaving unrelated measurements' cached content untouched

### Requirement: Sold measurements are excluded from public listing
A measurement in the "Sold" lifecycle state SHALL be treated as hidden from public listing; every other lifecycle state SHALL be treated as not hidden.

#### Scenario: Sold measurements are hidden
- **WHEN** a measurement's lifecycle state is "Sold"
- **THEN** the measurement is treated as hidden from public listing

#### Scenario: Non-sold measurements are not hidden
- **WHEN** a measurement's lifecycle state is "Created" or "Selling"
- **THEN** the measurement is treated as not hidden from public listing
