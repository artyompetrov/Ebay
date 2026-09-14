# lot-for-sale-listing Specification

## Purpose

Assigning short, unique identifiers to lots offered for sale, so every listed lot has a valid, non-colliding id.

## Requirements

### Requirement: Lot-for-sale identifier format
A lot-for-sale id SHALL be exactly 7 characters long. Creating a lot with an id of any other length SHALL be rejected.

#### Scenario: A 7-character id is accepted
- **WHEN** a lot-for-sale is created with a 7-character id
- **THEN** the lot is created with that id

#### Scenario: An id of the wrong length is rejected
- **WHEN** a lot-for-sale is created with an id shorter than 7 characters
- **THEN** creation fails

### Requirement: Lot-for-sale identifier generation is collision-free
The system SHALL generate lot-for-sale ids such that every id produced - even when many are generated in immediate succession within the same second - is unique and matches the required 7-character length.

#### Scenario: Rapidly generated ids never collide
- **WHEN** a large number of lot-for-sale ids are generated in immediate succession
- **THEN** every generated id is unique and matches the required 7-character length
